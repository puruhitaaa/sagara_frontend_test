"use client"

import { Box, ChartLine, TrendingUp, UsersRound } from "lucide-react"
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
      <div className='flex flex-col space-y-2 md:items-center md:flex-row md:justify-between'>
        <CalendarDateRangePicker />
        <TimelinePicker />
      </div>

      {!loadingUsersCount ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          <Card
            color='blue'
            title='Total Students'
            amount={usersCount?.totalCount}
            // stats={usersCount?.percentage}
            stats={100}
          />
          <Card
            color='red'
            title='Total Certified Students'
            amount={usersCount?.totalCount}
            // stats={usersCount?.percentage}
            stats={70}
          />
          <Card
            color='green'
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
  color,
  title,
  amount = 0,
  stats,
}: {
  color?: string
  title: string
  amount?: number
  stats?: number
}) => {
  function _renderIconWrapper() {
    switch (color) {
      case "blue":
        return (
          <div className='bg-blue-200 p-2 rounded h-fit'>{_renderIcon()}</div>
        )
      case "red":
        return (
          <div className='bg-red-200 p-2 rounded h-fit'>{_renderIcon()}</div>
        )
      case "green":
        return (
          <div className='bg-green-200 p-2 rounded h-fit'>{_renderIcon()}</div>
        )
      default:
        return null
    }
  }
  function _renderIcon() {
    switch (color) {
      case "blue":
        return (
          <MapIcon
            className='fill-blue-500 text-foreground dark:text-background stroke-1 h-7 w-7'
            title={title}
          />
        )
      case "red":
        return (
          <MapIcon
            className='fill-red-500 text-foreground dark:text-background stroke-1 h-7 w-7'
            title={title}
          />
        )
      case "green":
        return (
          <MapIcon
            className='fill-green-500 text-foreground dark:text-background stroke-1 h-7 w-7'
            title={title}
          />
        )
      default:
        return null
    }
  }
  return (
    <ShadCard className='rounded'>
      <CardHeader className='flex flex-row justify-between space-y-0 pb-2'>
        <CardTitle className='font-bold text-base text-muted-foreground'>
          {title}
        </CardTitle>
        {_renderIconWrapper()}
      </CardHeader>

      <CardContent className='space-y-[1.625rem]'>
        <div className='text-2xl font-bold'>{amount}</div>
        <p className='text-muted-foreground md:inline-flex md:items-center md:gap-1'>
          <span className='inline-flex items-center gap-1 text-green-700'>
            <TrendingUp className='h-4 w-4' />
            {stats}%
          </span>{" "}
          Up from yesterday
        </p>
      </CardContent>
    </ShadCard>
  )
}
