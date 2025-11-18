import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // ✅ LINHA 2 - Mudar import
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Search, TrendingUp, Lock, Unlock, X, Camera, MoreVertical, Settings, Trash2, UserX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CATEGORIES = [
  "Fitness Geral",
  "Corrida",
  "Musculação",
  "Yoga",
  "CrossFit",
  "Funcional",
  "Emagrecimento",
  "Outro"
];

export default function Communities() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState(null);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Fitness Geral");
  const [isPublic, setIsPublic] = useState(true);
  const [rules, setRules] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        // ✅ LINHA 45 - Mudar auth.me() para auth.getUser()
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)
      } catch (error) {
        console.log("User not logged in")
      }
    }
    getUser()
  }, [])

  const { data: communities = [] } = useQuery({
    queryKey: ['communities'],
    queryFn: async () => {
      // ✅ LINHA 57 - Mudar entities.list() para supabase.from().select()
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('created_date', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    initialData: [],
    staleTime: 2 * 60 * 1000
  })

  const { data: myMemberships = [] } = useQuery({
    queryKey: ['myMemberships', currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return []
      // ✅ LINHA 72 - Mudar entities.filter() para supabase.from().select()
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('user_email', currentUser.email)
        .eq('status', 'approved')
      
      if (error) throw error
      return data || []
    },
    enabled: !!currentUser?.email,
    initialData: []
  })

  const createCommunityMutation = useMutation({
    mutationFn: async (communityData) => {
      // ✅ LINHA 87 - Mudar entities.create() para supabase.from().insert()
      const { data, error } = await supabase
        .from('communities')
        .insert(communityData)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: async (newCommunity) => {
      // ✅ LINHA 96 - Mudar entities.create() para supabase.from().insert()
      const { error } = await supabase
        .from('community_members')
        .insert({
          community_id: newCommunity.id,
          user_email: currentUser.email,
          status: 'approved',
          role: 'owner'
        })
      
      if (error) throw error
      
      queryClient.invalidateQueries(['communities'])
      queryClient.invalidateQueries(['myMemberships'])
      setShowCreateModal(false)
      resetForm()
    }
  })

  const deleteCommunityMutation = useMutation({
    mutationFn: async (communityId) => {
      // ✅ LINHA 115-135 - Mudar todas as operações para Supabase
      
      // Delete all members first
      const { data: members } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
      
      if (members && members.length > 0) {
        await supabase
          .from('community_members')
          .delete()
          .in('id', members.map(m => m.id))
      }
      
      // Delete all posts
      const { data: posts } = await supabase
        .from('community_posts')
        .select('*')
        .eq('community_id', communityId)
      
      if (posts && posts.length > 0) {
        await supabase
          .from('community_posts')
          .delete()
          .in('id', posts.map(p => p.id))
      }
      
      // Finally delete community
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', communityId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communities'])
      queryClient.invalidateQueries(['myMemberships'])
      setCommunityToDelete(null)
    }
  })

  const joinCommunityMutation = useMutation({
    mutationFn: async (communityId) => {
      const community = communities.find(c => c.id === communityId)
      
      // ✅ LINHA 154 - Mudar entities.create() para supabase.from().insert()
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          community_id: communityId,
          user_email: currentUser.email,
          status: community.is_public ? 'approved' : 'pending',
          role: 'member'
        })
      
      if (memberError) throw memberError

      if (community.is_public) {
        // ✅ LINHA 166 - Mudar entities.update() para supabase.from().update()
        const { error: updateError } = await supabase
          .from('communities')
          .update({
            members_count: (community.members_count || 0) + 1
          })
          .eq('id', communityId)
        
        if (updateError) throw updateError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myMemberships'])
      queryClient.invalidateQueries(['communities'])
    }
  })

  const handleImageUpload = async (file) => {
    setIsUploading(true)
    try {
      // ✅ LINHA 183 - Upload no Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('community-covers')
        .upload(fileName, file)

      if (error) throw error

      // ✅ Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('community-covers')
        .getPublicUrl(fileName)

      setCoverPhoto(publicUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Erro ao fazer upload da imagem")
    }
    setIsUploading(false)
  }

  const handleCreateCommunity = () => {
    if (!name.trim() || !description.trim()) {
      alert("Preencha nome e descrição!")
      return
    }

    createCommunityMutation.mutate({
      name,
      description,
      category,
      is_public: isPublic,
      rules,
      cover_photo: coverPhoto,
      owner_email: currentUser.email,
      moderators: [currentUser.email],
      members_count: 1
    })
