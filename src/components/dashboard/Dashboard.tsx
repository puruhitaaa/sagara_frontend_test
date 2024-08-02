"use client"

import { Box, ChartLine, UsersRound } from "lucide-react"
import {
  Card as ShadCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { trpc } from "@/lib/trpc/client"
import { cn } from "@/lib/utils"
import { Overview } from "./Overview"
import { CalendarDateRangePicker } from "../ui/date-range-picker"
import TimelinePicker from "./TimelinePicker"

export default function Dashboard() {
  const { data: usersCount, isLoading: loadingUsersCount } =
    trpc.users.getUserCountByRoleUser.useQuery()

  return (
    <div className='space-y-8'>
      <div className='flex md:items-center md:flex-row md:justify-between'>
        <CalendarDateRangePicker />
        <TimelinePicker />
      </div>

      {!loadingUsersCount ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          <Card
            title='Total Students'
            amount={usersCount?.totalCount}
            // stats={usersCount?.percentage}
            stats={100}
          />
          <Card
            title='Total Certified Students'
            amount={usersCount?.totalCount}
            // stats={usersCount?.percentage}
            stats={70}
          />
          <Card
            title='Average Certification Score'
            amount={usersCount?.totalCount}
            // stats={usersCount?.percentage}
            stats={80}
          />
        </div>
      ) : null}

      <ShadCard>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className='pl-2'>
          <Overview />
        </CardContent>
      </ShadCard>
    </div>
  )
}

const IconMap: { [key: string]: React.ComponentType<any> } = {
  totalstudents: UsersRound,
  totalcertifiedstudents: Box,
  averagecertificationscore: ChartLine,
}

function MapIcon({
  className,
  title,
  ...rest
}: React.HTMLAttributes<SVGSVGElement> & { title: string }) {
  const IconComponent = IconMap[title.split(" ").join("").toLowerCase()]
  return IconComponent ? (
    <IconComponent className={cn("h-7 w-7", className)} {...rest} />
  ) : null
}

const Card = ({
  title,
  amount = 0,
  stats,
}: {
  title: string
  amount?: number
  stats?: number
}) => {
  return (
    <ShadCard className='rounded'>
      <CardHeader className='flex flex-row justify-between space-y-0 pb-2'>
        <CardTitle className='font-bold text-base text-muted-foreground'>
          {title}
        </CardTitle>
        <div className='p-2 bg-blue-500/50 rounded'>
          <MapIcon className='fill-blue-500' title={title} />
        </div>
      </CardHeader>

      <CardContent className='space-y-[1.625rem]'>
        <div className='text-2xl font-bold'>{amount}</div>
        <p className='text-muted-foreground'>{stats}% Up from yesterday</p>
      </CardContent>
    </ShadCard>
  )
}
