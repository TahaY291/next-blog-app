'use client'
import { assets } from '@/assets/assets'
import Image from 'next/image'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const page = () => {
    const [image, setImage] = useState(false)
    const [data, setData] = useState({
        title: "",
        description: "",
        category: "Startup",
        author: "Alex Bannett",
        authorImg: "/author_img.png"
    })
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))

    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        formData.append('category', data.category)
        formData.append('author', data.author)
        formData.append('authorImg', data.authorImg)
        formData.append('image', image)
        const response = await axios.post('/api/blog', formData)
        if (response.data.success) {
            toast.success(response.data.msg)
            setImage(false)
            setData({
                title: "",
                description: "",
                category: "Startup",
                author: "Alex Bannett",
                authorImg: "/author_img.png"
            })
        } else {
            toast.error("Error")
        }
    }
    return (
        <>
            <form onSubmit={onSubmitHandler} className='pt-5 px-5 sm:pt-12 sm:pl-16'>
                <p className='text-lg'>Upload Thumbnail</p>
                <label htmlFor="image">
                    <div className="relative w-[140px] h-[70px] mt-4">
                        <Image
                            src={!image ? assets.upload_area : URL.createObjectURL(image)}
                            alt=""
                            fill
                            sizes="140px"
                            className="object-contain"
                        />
                    </div>

                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' hidden required />
                <p className='text-xl mt-4'>Blog title</p>
                <input name="title" onChange={onChangeHandler} value={data.title} type='text' required placeholder='Type here' className='w-full sm:w-[500px] mt-4 px-4 py-3 border' />
                <p className='text-xl mt-4'>Blog description</p>
                <textarea name="description" onChange={onChangeHandler} value={data.description} type='text' required placeholder='write content here' rows={6} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' />
                <p className='text-xl mt-4'>Category</p>
                <select name='category' onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
                    <option value="Startup">Startup</option>
                    <option value="Technology">Technlogy</option>
                    <option value="Lifestyle">Lifestyle</option>
                </select>
                <br />
                <button onClick={onSubmitHandler} className='mt-8 w-40 h-12 bg-black text-white cursor-pointer' type='button'>Add</button>
            </form>
        </>
    )
}

export default page
