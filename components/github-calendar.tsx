"use client"
import dynamic from "next/dynamic"
import React, { useCallback, useState } from "react"

const GitHubCalendar = dynamic(() => import("react-github-calendar") as Promise<any>, {
  ssr: false,
  loading: () => <div className="h-[159px] w-full" />,
})

function GithubCalendar() {
  const [totalCount, setTotalCount] = useState(0)

  const processContributions = useCallback((contributions: any[]) => {
    // Hack to calculate total count after rendering
    setTimeout(() => {
      const total = contributions.map((el) => el.count).reduce((acc, curr) => acc + curr, 0)

      setTotalCount(total)
    }, 0)

    // return a slice of the data so the calendar fits nicely (same idea as before)
    return contributions.slice(91, 365)
  }, [])

  const GH: React.ComponentType<any> = GitHubCalendar as unknown as React.ComponentType<any>

  return (
    <div className="github-calendar-wrapper mx-auto flex justify-center my-1">
      <GH username="teja-pola" transformData={processContributions} totalCount={totalCount} />
      <style>{`.github-calendar-wrapper .ContributionCalendar-label, .github-calendar-wrapper h2 { display: none !important; }`}</style>
    </div>
  )
}

export default GithubCalendar
