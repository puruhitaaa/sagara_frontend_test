"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  {
    name: "Back End",
    total: 289,
  },
  {
    name: "Front End",
    total: 270,
  },
  {
    name: "Quality Assurance",
    total: 304,
  },
  {
    name: "UI/UX",
    total: 240,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          className='text-muted-foreground text-sm'
          dataKey='name'
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          className='text-muted-foreground text-sm'
          tickLine={false}
          axisLine={false}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          barSize={60}
          radius={[4, 4, 0, 0]}
          className='fill-brand-red'
        />
        <Tooltip cursor={false} />
      </BarChart>
    </ResponsiveContainer>
  )
}
