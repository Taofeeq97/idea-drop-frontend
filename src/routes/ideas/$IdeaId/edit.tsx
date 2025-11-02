import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation, queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { fetchIdea, editIdea } from '@/api/ideas'

const ideaQueryOptions = (ideaId:string) => queryOptions({
    queryKey:['idea', ideaId],
    queryFn: () => fetchIdea(ideaId)
})

export const Route = createFileRoute('/ideas/$IdeaId/edit')({
  component: EditIdeaPage,
  loader: async ({params, context:{queryClient}}) => {
    return queryClient.ensureQueryData(ideaQueryOptions(params.IdeaId))
  }
})

function EditIdeaPage() {
    const {IdeaId} = Route.useParams();
    const navigate = useNavigate();
    const {data: idea} = useSuspenseQuery(ideaQueryOptions(IdeaId))
    const [title, setTitle] = useState(idea.title)
    const [summary, setSummary] = useState(idea.summary)
    const [description, setDescription] = useState(idea.description)
    const [tagsinput, setTagsInput] = useState(idea.tags.join(', '))

    const {mutateAsync, isPending} = useMutation({
        mutationFn: () => editIdea(IdeaId, {
            title,
            summary,
            description,
            tags: tagsinput.split(',').map((tag)=> tag.trim()).filter(Boolean)
        }),
        onSuccess: () => {
            navigate({
                to: '/ideas/$IdeaId', params:{IdeaId}
            })
        }
    })

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault(),
        await mutateAsync()
    }
  return (
     <form onSubmit={handleSubmit} className='space-y-4'>
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Edit Idea</h1>
            <Link to='/ideas/$IdeaId' params={{IdeaId}} className='tex-sm text-blue-600 hover:underline'>Go Back</Link>
        </div>
      <div>
        <label htmlFor='title' className='block text-gray-700 font-medium mb-1'>
          Title
        </label>
        <input 
        id='title'
        type='text'
        value={title}
        onChange={(e)=> {setTitle(e.target.value)}}
        className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Enter Idea Title'
          />
      </div>
      <div>
        <label htmlFor='summary' className='block text-gray-700 font-medium mb-1'>
          Summary
        </label>
        <input 
        id='summary'
        type='text'
        value={summary}
        onChange={(e)=> {setSummary(e.target.value)}}
        className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Enter Idea Summary'
          />
      </div>
      <div>
        <label htmlFor='body' className='block text-gray-700 font-medium mb-1'>
          Description
        </label>
        <textarea 
        id='body'
        value={description}
        rows={6}
        onChange={(e)=> {setDescription(e.target.value)}}
        className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Write out the description of your Idea'
          />
      </div>
      <div>
        <label htmlFor='tags' className='block text-gray-700 font-medium mb-1'>
          Tags
        </label>
        <input 
        id='tags'
        type='text'
        value={tagsinput}
        onChange={(e)=> {setTagsInput(e.target.value)}}
        className='w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        placeholder='Optional Tags, Comma Separated'
          />
      </div>
      <div className='mt-6'>
        <button 
        disabled={isPending}
        type='submit'
        className='block w-full bg-blue-600 hover:bg-blue-700 rounded-md font-semibold px-4 py-3 text-white transition disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isPending ? "updating Idea..." : "Update Idea"}
        </button>
      </div>

    </form>
  )
}
