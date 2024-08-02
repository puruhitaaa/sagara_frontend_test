import { useSearchParams, useRouter } from "next/navigation"
import { useCallback, useMemo } from "react"

type SearchParams = {
  [key: string]: string | undefined
}

type UseSearchReturn = {
  searchParams: URLSearchParams
  getParam: (key: string) => string | null
  setParam: (key: string, value: string) => void
  pushToRoute: (newParams: SearchParams) => void
}

const useSearch = (): UseSearchReturn => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key)
    },
    [searchParams]
  )

  const setParam = useCallback(
    (key: string, value: string) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set(key, value)
      router.push(`?${newSearchParams.toString()}`)
    },
    [searchParams, router]
  )

  const pushToRoute = useCallback(
    (newParams: SearchParams) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())
      Object.keys(newParams).forEach((key) => {
        const value = newParams[key]
        if (value) {
          newSearchParams.set(key, value)
        } else {
          newSearchParams.delete(key)
        }
      })
      router.push(`?${newSearchParams.toString()}`)
    },
    [searchParams, router]
  )

  return useMemo(
    () => ({
      searchParams,
      getParam,
      setParam,
      pushToRoute,
    }),
    [searchParams, getParam, setParam, pushToRoute]
  )
}

export default useSearch
