import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { fetchIdea, deleteIdea } from '@/api/ideas'
import { useAuth } from '@/context/authContext'


  const ideaQueryOptions = (ideaId:string) => queryOptions
  ({
    queryKey: ['idea', ideaId],
    queryFn: () => fetchIdea(ideaId)
  })

export const Route = createFileRoute('/ideas/$IdeaId/')({
  component: IdeaDetailsPage,
  loader: async ({params, context: {queryClient}}) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.IdeaId))
  }
})

function IdeaDetailsPage() {
  const {IdeaId} = Route.useParams()
  const {data: idea} = useSuspenseQuery(ideaQueryOptions(IdeaId))
  const navigate = useNavigate()
  const {mutateAsync:deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteIdea(IdeaId),
    onSuccess: () => {
      navigate({to:'/ideas'})
    }
  })

  const handleIdeaDelete = async () => {
    const confirmDelete = window.confirm('Are you sure want to delete ')
    if (confirmDelete) {
      await deleteMutate()
    }
  }

  const {user} = useAuth();

  return (
    <div className='p-4'>
      <Link to='/ideas' className='text-blue-500 uderline block mb-4'>
      Back to Ideas
      </Link>
      <h2 className='text-2xl'>{idea.title}</h2>
      <p className='mt-2'>{idea.description}</p>
      {user && user.id === idea.user && (
       <>
        <Link to='/ideas/$IdeaId/edit' params={{IdeaId}}  className='text-sm bg-yellow-500 text-white mt-4 mr-3 px-5 py-2.5 transition 
            hover:bg-yellow-700 disabled:opacity-50 rounded-sm'>Edit Idea</Link>
            <button 
      onClick={handleIdeaDelete}
      disabled={isPending} 
      className='text-sm bg-red-600 text-white mt-4 px-4 py-2 transition 
            hover:bg-red-800 disabled:opacity-50 rounded-sm' >
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
      </>
      )}
    
  </div>
  )
}
