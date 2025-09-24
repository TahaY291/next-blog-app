import { connectDB } from "@/lib/config/db"
import { writeFile } from 'fs/promises'
const { NextResponse } = require("next/server")
import BlogModel from "@/lib/models/BlogModel"
const fs = require('fs')

const loadDB = async () => {
  await connectDB();
}
loadDB()

export async function GET(request) {
  const blogId = request.nextUrl.searchParams.get("id");
  if (blogId) {
    const blog = await BlogModel.findById(blogId)
    return NextResponse.json({ blog })
  } else {
    const blogs = await BlogModel.find()
    return NextResponse.json({ blogs })
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData()
    const timestamp = Date.now()
    const image = await formData.get('image')

    const imageByteData = await image.arrayBuffer()
    const buffer = Buffer.from(imageByteData)

    const path = `./public/${timestamp}_${image.name}`

    await writeFile(path, buffer)

    const imgUrl = `/${timestamp}_${image.name}`

    console.log("Form data received:", {
      title: formData.get("title"),
    });

    // Blog data
    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      authorImg: formData.get("authorImg"),
      image: imgUrl,
    }

    // ✅ Save blog in DB
    const savedBlog = await BlogModel.create(blogData)

    console.log("Blog saved:", savedBlog)

    return NextResponse.json({
      success: true,
      msg: "Blog added successfully",
    })
  } catch (error) {
    console.error("Error saving blog:", error) // ✅ log real error
    return NextResponse.json({ error: error.message }) // ✅ return actual error
  }
}

export async function DELETE (request) {
  const id = await request.nextUrl.searchParams.get('id')
  const blog = await BlogModel.findById(id)
  fs.unlink(`./public${blog.image}`,()=>{});
  await BlogModel.findByIdAndDelete(id)
  return NextResponse.json({msg:"Blog Deleted"})
}