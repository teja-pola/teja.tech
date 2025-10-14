package main

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"sync"
	"time"
)

type sseBroker struct {
	mu       sync.Mutex
	clients  map[chan string]struct{}
	count    int
	shutdown chan struct{}
}

func newBroker() *sseBroker {
	return &sseBroker{
		clients:  make(map[chan string]struct{}),
		shutdown: make(chan struct{}),
	}
}

func (b *sseBroker) addClient(ch chan string) {
	b.mu.Lock()
	defer b.mu.Unlock()
	b.clients[ch] = struct{}{}
}

func (b *sseBroker) removeClient(ch chan string) {
	b.mu.Lock()
	defer b.mu.Unlock()
	delete(b.clients, ch)
	close(ch)
}

func (b *sseBroker) inc() {
	b.mu.Lock()
	b.count++
	count := b.count
	b.mu.Unlock()
	b.broadcast(count)
}

func (b *sseBroker) dec() {
	b.mu.Lock()
	if b.count > 0 {
		b.count--
	}
	count := b.count
	b.mu.Unlock()
	b.broadcast(count)
}

func (b *sseBroker) broadcast(count int) {
	b.mu.Lock()
	for ch := range b.clients {
		select {
		case ch <- strconv.Itoa(count):
		default:
		}
	}
	b.mu.Unlock()
}

type server struct {
	tmpl   *template.Template
	broker *sseBroker
}

func main() {
	// Resolve paths
	cwd, _ := os.Getwd()
	tmplPath := filepath.Join(cwd, "go-server", "templates", "*.gohtml")
	staticPath := filepath.Join(cwd, "go-server", "static")

	tmpl := template.Must(template.ParseGlob(tmplPath))
	s := &server{
		tmpl:   tmpl,
		broker: newBroker(),
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/", s.handleIndex)
	mux.Handle("/static/", http.StripPrefix("/static/", cacheControl(http.FileServer(http.Dir(staticPath)))))
	mux.HandleFunc("/events", s.handleSSE)

	addr := ":" + getenv("PORT", "8080")
	log.Printf("Starting server on http://localhost%s ...", addr)
	if err := http.ListenAndServe(addr, cors(mux)); err != nil {
		log.Fatal(err)
	}
}

func (s *server) handleIndex(w http.ResponseWriter, r *http.Request) {
	type link struct {
		Label string
		URL   string
	}
	data := map[string]any{
		"Name":        "Dharma Teja Pola",
		"Title":       "Full‑Stack AI Developer",
		"Summary":     "Building scalable AI agents, RAG systems, and Web3 solutions. 2× international hackathon wins and 4+ AI projects.",
		"Location":    "Andhra Pradesh, India",
		"Email":       "dharmatejapola@gmail.com",
		"Phone":       "+91 86885 24907",
		"Links": []link{
			{"LinkedIn", "https://www.linkedin.com/in/dharma-teja-pola"},
			{"GitHub", "https://github.com/"},
			{"Portfolio", "https://"},
		},
		"Projects": []map[string]string{
			{
				"Name":        "Cartify — AI Shopping Agent",
				"Desc":        "Voice-based product search across 50k+ items with Groq + Supabase; +35% engagement.",
				"CodeURL":     "https://github.com/",
				"LiveURL":     "https://",
				"Badge":       "Winner — Groq x Llama Track",
			},
			{
				"Name":        "Zesty — Unrecommendation Engine",
				"Desc":        "Qloo API + Groq LLM for contrarian content; +30% engagement.",
				"CodeURL":     "https://github.com/",
				"LiveURL":     "https://",
				"Badge":       "Honorable Mention — Qloo Hackathon",
			},
			{
				"Name":        "Zeo — AI Mental Health Companion",
				"Desc":        "3D empathetic companion with privacy-first WebRTC; +40% session engagement.",
				"CodeURL":     "https://github.com/",
				"LiveURL":     "https://",
				"Badge":       "3rd Prize — NovaSpark",
			},
		},
		"Achievements": []string{
			"Honorable Mention — Qloo LLM Hackathon 2025 ($5000)",
			"Winner — Raise Your Hack 2025 ($3000 Groq credits, Startup Program)",
			"Winner — NovaSpark 2025",
			"Top Contributor — GSOC 2025 (Accord Project)",
		},
	}
	if err := s.tmpl.ExecuteTemplate(w, "index.gohtml", data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (s *server) handleSSE(w http.ResponseWriter, r *http.Request) {
	// SSE headers
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	ctx := r.Context()

	// Channel for this client
	ch := make(chan string, 1)
	s.broker.addClient(ch)
	// Update counters
	s.broker.inc()

	// Ensure decrement and cleanup on disconnect
	defer func() {
		s.broker.dec()
		s.broker.removeClient(ch)
	}()

	// Send an initial ping and current count soon after connect
	go func() {
		time.Sleep(50 * time.Millisecond)
		s.broker.mu.Lock()
		count := s.broker.count
		s.broker.mu.Unlock()
		ch <- strconv.Itoa(count)
	}()

	// Stream loop
	for {
		select {
		case <-ctx.Done():
			return
		case msg := <-ch:
			// SSE format
			_, _ = w.Write([]byte("event: viewers\n"))
			_, _ = w.Write([]byte("data: " + msg + "\n\n"))
			flusher, ok := w.(http.Flusher)
			if ok {
				flusher.Flush()
			}
		}
	}
}

// Basic CORS (handy if you proxy or preview)
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func cacheControl(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "public, max-age=600")
		next.ServeHTTP(w, r)
	})
}

func getenv(k, def string) string {
	if v := os.Getenv(k); v != "" {
		return v
	}
	return def
}
