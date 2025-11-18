import React, { useState, useRef } from "react";
import { X, Plus, Trash2, Image as ImageIcon, Camera, Video, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/supabaseClient"; // ✅ LINHA 7 - Mudar import
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Musculação", "Cardio", "Yoga", "Crossfit", "Corrida", "Funcional"];
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export default function CreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [media, setMedia] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [exercises, setExercises] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const createPostMutation = useMutation({
    mutationFn: async (postData) => {
      // ✅ LINHA 32 - Mudar entities.create() para supabase.from().insert()
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      navigate(createPageUrl("Home"))
    }
  })

  const handleFileUpload = async (files, type = 'photo') => {
    if (media.length + files.length > 4) {
      alert("Máximo de 4 fotos/vídeos!")
      return
    }

    // Validar vídeos
    if (type === 'video') {
      for (let file of files) {
        if (file.size > MAX_VIDEO_SIZE) {
          alert(`Vídeo muito grande! Máximo 50MB. Tamanho: ${(file.size / 1024 / 1024).toFixed(1)}MB`)
          return
        }
        if (!file.type.startsWith('video/')) {
          alert("Apenas vídeos são permitidos!")
          return
        }
      }
    }

    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        // ✅ LINHA 65 - Upload no Supabase Storage
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const bucket = type === 'video' ? 'post-videos' : 'post-photos'
        
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, file)

        if (error) throw error

        // ✅ Obter URL pública
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName)

        setUploadProgress(((index + 1) / files.length) * 100)
        return { url: publicUrl, type }
      })
      
      const urls = await Promise.all(uploadPromises)
      setMedia([...media, ...urls])
      setShowMediaOptions(false)
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Erro ao fazer upload. Tente novamente.")
    }
    
    setIsUploading(false)
    setUploadProgress(0)
  }

  // ... O RESTANTE DO CÓDIGO (removeMedia, addExercise, updateExercise, removeExercise, handlePublish) PERMANECE IGUAL ...

  const handlePublish = () => {
    if (!description.trim()) {
      alert("Adicione uma descrição!")
      return
    }

    createPostMutation.mutate({
      description,
      photos: media.filter(m => m.type === 'photo').map(m => m.url),
      videos: media.filter(m => m.type === 'video').map(m => m.url),
      category,
      exercises: exercises.filter(e => e.name.trim())
    })
  }
