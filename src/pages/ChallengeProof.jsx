import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Camera, Image as ImageIcon, Video, Check } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export default function ChallengeProof() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const participantId = searchParams.get('participantId');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [notes, setNotes] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(true);
  
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

  const { data: challenge } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: async () => {
      
      const { data: challenges } = await supabase
        .from('challenges')
        .select('*')
      
      return challenges.find(c => c.id === challengeId)
    },
    enabled: !!challengeId
  })

  const submitProofMutation = useMutation({
    mutationFn: async (proofData) => {
      
      const { data, error } = await supabase
        .from('challenge_proof_submissions')
        .insert(proofData)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: async () => {
    
      const { data: participants } = await supabase
        .from('challenge_participants')
        .select('*')
      
      const current = participants.find(p => p.id === participantId)
      
      if (current) {
        await supabase
          .from('challenge_participants')
          .update({
            current_progress: (current.current_progress || 0) + 1
          })
          .eq('id', current.id)
      }
      
      queryClient.invalidateQueries(['challengeParticipation'])
      queryClient.invalidateQueries(['challengeProofs'])
      navigate(createPageUrl("Challenges"))
    }
  })

  const handleFileUpload = async (files, type) => {
    if (type === 'video' && files[0].size > MAX_VIDEO_SIZE) {
      alert(`Vídeo muito grande! Máximo 50MB. Tamanho: ${(files[0].size / 1024 / 1024).toFixed(1)}MB`)
      return
    }

    setIsUploading(true)
    try {
      
      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('challenge-proofs')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('challenge-proofs')
        .getPublicUrl(fileName)

      setMediaUrl(publicUrl)
      setMediaType(type)
      setShowMediaOptions(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Erro ao fazer upload. Tente novamente.")
    }
    setIsUploading(false)
  }

  const handleSubmit = () => {
    if (!mediaUrl) {
      alert("Adicione uma foto ou vídeo de comprovação!")
      return
    }

    submitProofMutation.mutate({
      challenge_id: challengeId,
      participant_id: participantId,
      user_email: currentUser?.email,
      photo_url: mediaUrl,
      notes: notes,
      progress_increment: 1
    })
  }
