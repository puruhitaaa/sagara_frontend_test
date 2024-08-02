import StudentList from "@/components/students/StudentList"
// import NewMediaModal from "@/components/media/MediaModal"

export default function Students() {
  return (
    <main>
      <div className='flex justify-between'>
        <h1 className='font-semibold text-2xl my-2'>Students Data</h1>
        {/* <NewMediaModal /> */}
      </div>
      <StudentList />
    </main>
  )
}
