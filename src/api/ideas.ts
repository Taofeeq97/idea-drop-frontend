import api from "@/lib/axios"
import type { Idea } from "@/types"

export const fetchIdeas = async (limit?:number):Promise<Idea[]> => {
  const response = await api.get('ideas', {
    params: limit ? {_limit:limit} : {}
  })
  return response.data
}


export const fetchIdea = async (IdeaId:string): Promise<Idea> => {
    const response = await api.get(`ideas/${IdeaId}`)
    return response.data
  }


export const createIdea = async (newIdea: {
    title:string,
    summary:string,
    tags:string[],
    description:string,

}):Promise<Idea> => {
    const response = await api.post('/ideas', {
        ...newIdea,
        createdAt: new Date().toISOString()
    })
    return response.data

}


export const deleteIdea = async (IdeaID:string): Promise<void> => {
    await api.delete(`ideas/${IdeaID}`)
}


export const editIdea = async (IdeaId:string, updatedData:{
    title:string,
    summary:string,
    tags:string[],
    description:string,
}): Promise<Idea> => {
    const response = await api.put(`ideas/${IdeaId}/`, updatedData )
    return response.data
}