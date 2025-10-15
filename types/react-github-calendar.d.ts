declare module 'react-github-calendar' {
  import * as React from 'react'

  export interface Activity {
    date: string
    count: number
  }

  interface Props {
    username: string
    transformData?: (data: Activity[]) => Activity[]
    totalCount?: number
    [key: string]: any
  }

  const GitHubCalendar: React.ComponentType<Props>
  export default GitHubCalendar
}
