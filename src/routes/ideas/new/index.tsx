import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { createIdea } from '@/api/ideas'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/ideas/new/')({
  component: NewIdeaPage,
})

function NewIdeaPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')

  const {mutateAsync, isPending } = useMutation({
    mutationFn: createIdea,
    onSuccess: () => {
      navigate({to:'/ideas'})
    }
  })

  const handleSubmit = async (e:React.FormEvent) =>{
    e.preventDefault()
    if (!title.trim() || !summary.trim() || !description.trim()) {
      alert('Please fill all required fields')
      return
    }

    try {
      await mutateAsync({
        title,
        summary,
        description,
        tags: tags.split(',').map((tag)=> tag.trim()).filter((tag) => tag !== "")
      })
    }catch {
      alert('Something Went wrong')
    }

  }

  return <div className='space-y-6'>
    

    <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">New Idea</h1>
                <Link to='/ideas' className='tex-sm text-blue-600 hover:underline'>Go Back</Link>
            </div>
          <div></div>
    <form onSubmit={handleSubmit} className='space-y-4'>
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
        value={tags}
        onChange={(e)=> {setTags(e.target.value)}}
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
          { isPending ? 'Creating Idea...':'Create Idea'}
        </button>
      </div>

    </form>
  </div>
}
