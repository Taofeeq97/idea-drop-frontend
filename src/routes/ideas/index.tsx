import { createFileRoute } from '@tanstack/react-router'
import { fetchIdeas } from '@/api/ideas'
import type { Idea } from '@/types'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import IdeaCard from '@/components/IdeaCard'


const ideasQueryOptions = () => queryOptions
({
   queryKey: ['ideas'],
   queryFn: () => fetchIdeas()
})


export const Route = createFileRoute('/ideas/')({
  head: () => ({
    meta: [
      {
        title: 'Idea Hub Browse Idea'
      }
    ],
  }),
  component: IdeasPages,
  loader: async ({context: {queryClient} }) =>{
    return queryClient.ensureQueryData(ideasQueryOptions())
  }
})

function IdeasPages() {
  const { data: ideas } = useSuspenseQuery(ideasQueryOptions())
  
  return (
    <div>
      
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Ideas</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ideas.map((idea:Idea) => (
          
          <IdeaCard key={idea._id} idea={idea}/>
          
        ))}
        </div>
      </div>
    </div>
  )
}