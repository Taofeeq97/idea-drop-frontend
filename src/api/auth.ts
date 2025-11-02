import api from "@/lib/axios"

export const registerUser = async ({
    name,
    email,
    password
}:{
    name:string,
    email:string,
    password:string
}) => {
    try {
        const response = await api.post('/auth/register', {
        name,
        email,
        password
    })
    return response.data
    } catch (err:any) {
        console.log(err)
        const message= err.response?.data?.message || "Failed to register"
        throw new Error(message)
    }

}


export const loginUser = async ({
    email,
    password
}:{
    email:string,
    password:string
}) => {
    try {
        const response = await api.post('/auth/login', {
        email,
        password
    })
    return response.data
    } catch (err:any) {
        console.log(err)
        const message= err.response?.data?.message || "Failed to login"
        throw new Error(message)
    }

}


export const logoutUser = async () => {
    try {
    await api.post('/auth/logout')
    } catch (err: any) {
        console.log(err)
        const message= err.response?.data?.message || "Failed to logout"
        throw new Error(message)
        
    }
}


export const refreshAccessToken = async () => {
    try {
        const res = await api.post('/auth/refresh')
        return res.data
    } catch (err:any) {
        console.log(err)
        const message= err.response?.data?.message || "Failed to logout"
        throw new Error(message)
    }
}