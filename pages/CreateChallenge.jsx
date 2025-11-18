import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient"; 
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Upload, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";

const CHALLENGE_TYPES = ["Dias Consecutivos", "Meta de Treinos", "Objetivo de Peso", "Competição"];

export default function CreateChallenge() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [virtualPrize, setVirtualPrize] = useState("");
  const [prizeIcon, setPrizeIcon] = useState("🏆");
  const [prizeRarity, setPrizeRarity] = useState("Ouro");
  const [isPublic, setIsPublic] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)
      } catch (error) {
        console.log("User not logged in")
      }
    }
    getUser()
  }, [])

  const handleImageUpload = async (file) => {
    setIsUploading(true)
    try {
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('challenge-images')
        .upload(fileName, file)

      if (error) throw error

      
      const { data: { publicUrl } } = supabase.storage
        .from('challenge-images')
        .getPublicUrl(fileName)

      setImageUrl(publicUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Erro ao fazer upload da imagem")
    }
    setIsUploading(false)
  }

  const createChallengeMutation = useMutation({
    mutationFn: async (challengeData) => {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + parseInt(durationDays))

      
      const { data, error } = await supabase
        .from('challenges')
        .insert({
          ...challengeData,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0],
          participants_count: 0
        })
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      navigate(createPageUrl("Challenges"))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title || !description || !type || !targetValue || !durationDays) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    createChallengeMutation.mutate({
      creator_email: currentUser?.email,
      title,
      description,
      image_url: imageUrl,
      type,
      target_value: parseInt(targetValue),
      duration_days: parseInt(durationDays),
      virtual_prize: virtualPrize,
      prize_icon: prizeIcon,
      prize_rarity: prizeRarity,
      is_public: isPublic
    })
  }
