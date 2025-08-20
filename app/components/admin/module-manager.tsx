"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Video,
  HelpCircle,
  MousePointer,
  Download,
  MoreVertical,
  LinkIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAdmin } from "../../contexts/admin-context"
import type { ModuleContent } from "../../contexts/admin-context"

export default function ModuleManager() {
  const {
    modules,
    updateModule,
    addModuleContent,
    updateModuleContent,
    deleteModuleContent,
    exportModulesToExcel,
    availablePlans,
  } = useAdmin()
  const [isAddingContent, setIsAddingContent] = useState(false)
  const [editingContent, setEditingContent] = useState<ModuleContent | null>(null)
  const [selectedModuleId, setSelectedModuleId] = useState<string>("")
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    link: "",
    type: "document" as const,
    duration: 5,
    plans: [] as string[],
    links: [] as Array<{ title: string; url: string; description: string }>,
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4 text-red-500" />
      case "document":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-purple-500" />
      case "interactive":
        return <MousePointer className="w-4 h-4 text-green-500" />
      default:
        return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "vídeo"
      case "document":
        return "documento"
      case "quiz":
        return "quiz"
      case "interactive":
        return "interativo"
      default:
        return type
    }
  }

  const handleModuleToggle = (moduleId: string, isActive: boolean) => {
    console.log(`🔄 Alternando módulo ${moduleId} para ${isActive ? "ativo" : "inativo"}`)
    updateModule(moduleId, { isActive })
  }

  const handleContentToggle = (moduleId: string, contentId: string, isActive: boolean) => {
    console.log(`🔄 Alternando conteúdo ${contentId} do módulo ${moduleId} para ${isActive ? "ativo" : "inativo"}`)
    updateModuleContent(moduleId, contentId, { isActive })
  }

  const handleAddContent = () => {
    if (!selectedModuleId) return

    const contentData = {
      ...newContent,
      isActive: true,
    }

    console.log(`➕ Adicionando novo conteúdo ao módulo ${selectedModuleId}:`, contentData)
    addModuleContent(selectedModuleId, contentData)

    setNewContent({
      title: "",
      description: "",
      link: "",
      type: "document",
      duration: 5,
      plans: [],
      links: [],
    })
    setIsAddingContent(false)
    setSelectedModuleId("")
  }

  const handleEditContent = (moduleId: string, content: ModuleContent) => {
    setSelectedModuleId(moduleId)
    setEditingContent(content)
    setNewContent({
      title: content.title,
      description: content.description,
      link: content.link,
      type: content.type,
      duration: content.duration,
      plans: content.plans,
      links: content.links || [],
    })
  }

  const handleUpdateContent = () => {
    if (!selectedModuleId || !editingContent) return

    updateModuleContent(selectedModuleId, editingContent.id, newContent)
    setEditingContent(null)
    setSelectedModuleId("")
    setNewContent({
      title: "",
      description: "",
      link: "",
      type: "document",
      duration: 5,
      plans: [],
      links: [],
    })
  }

  const handleDeleteContent = (moduleId: string, contentId: string) => {
    if (confirm("Tem certeza que deseja excluir este conteúdo?")) {
      deleteModuleContent(moduleId, contentId)
    }
  }

  const addLink = () => {
    setNewContent((prev) => ({
      ...prev,
      links: [...prev.links, { title: "", url: "", description: "" }],
    }))
  }

  const updateLink = (index: number, field: string, value: string) => {
    setNewContent((prev) => ({
      ...prev,
      links: prev.links.map((link, i) => (i === index ? { ...link, [field]: value } : link)),
    }))
  }

  const removeLink = (index: number) => {
    setNewContent((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Módulos</h2>
          <p className="text-gray-600">Gerencie módulos, conteúdos e segmentação por planos</p>
        </div>
        <Button onClick={exportModulesToExcel} className="flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Exportar Excel</span>
        </Button>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        {modules.map((module) => (
          <Card key={module.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{module.name}</CardTitle>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`module-${module.id}`} className="text-sm font-medium">
                      {module.isActive ? (
                        <span className="flex items-center text-green-600">
                          <Eye className="w-4 h-4 mr-1" />
                          Visível
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <EyeOff className="w-4 h-4 mr-1" />
                          Oculto
                        </span>
                      )}
                    </Label>
                    <Switch
                      id={`module-${module.id}`}
                      checked={module.isActive}
                      onCheckedChange={(checked) => handleModuleToggle(module.id, checked)}
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedModuleId(module.id)
                      setIsAddingContent(true)
                    }}
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Conteúdo</span>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {module.plans.map((plan) => (
                  <Badge key={plan} variant="outline" className="text-xs">
                    {plan}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {module.contents.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum conteúdo adicionado ainda</p>
                </div>
              ) : (
                <div className="divide-y">
                  {module.contents.map((content) => (
                    <div key={content.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(content.type)}
                            <div className="flex items-center space-x-1">
                              {content.isActive ? (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <Eye className="w-4 h-4" />
                                  <span className="text-xs font-medium">Visível</span>
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1 text-gray-400">
                                  <EyeOff className="w-4 h-4" />
                                  <span className="text-xs font-medium">Oculto</span>
                                </div>
                              )}
                            </div>
                            {content.links && content.links.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <LinkIcon className="w-3 h-3 mr-1" />
                                {content.links.length} links
                              </Badge>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                            <p className="text-sm text-gray-600 truncate">{content.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                              <Badge className="bg-gray-100 text-gray-700" variant="secondary">
                                {getTypeLabel(content.type)}
                              </Badge>
                              <span>{content.duration} min</span>
                              <span>
                                {content.plans.length} plano{content.plans.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex flex-wrap gap-1">
                            {content.plans.slice(0, 2).map((plan) => (
                              <Badge key={plan} variant="outline" className="text-xs">
                                {plan.split(" ")[1]}
                              </Badge>
                            ))}
                            {content.plans.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{content.plans.length - 2}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center space-x-1">
                            <Switch
                              checked={content.isActive}
                              onCheckedChange={(checked) => handleContentToggle(module.id, content.id, checked)}
                              size="sm"
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditContent(module.id, content)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteContent(module.id, content.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Content Dialog */}
      <Dialog open={isAddingContent} onOpenChange={setIsAddingContent}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Conteúdo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) => setNewContent((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Título do conteúdo"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) => setNewContent((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do conteúdo"
              />
            </div>
            <div>
              <Label htmlFor="link">Link Principal</Label>
              <Input
                id="link"
                value={newContent.link}
                onChange={(e) => setNewContent((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="URL do conteúdo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={newContent.type}
                  onValueChange={(value: any) => setNewContent((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="document">Documento</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="interactive">Interativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newContent.duration}
                  onChange={(e) =>
                    setNewContent((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 5 }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Planos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availablePlans.map((plan) => (
                  <div key={plan} className="flex items-center space-x-2">
                    <Checkbox
                      id={`plan-${plan}`}
                      checked={newContent.plans.includes(plan)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewContent((prev) => ({ ...prev, plans: [...prev.plans, plan] }))
                        } else {
                          setNewContent((prev) => ({ ...prev, plans: prev.plans.filter((p) => p !== plan) }))
                        }
                      }}
                    />
                    <Label htmlFor={`plan-${plan}`} className="text-sm">
                      {plan}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Adicionais */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Links Adicionais</Label>
                <Button type="button" size="sm" variant="outline" onClick={addLink}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Link
                </Button>
              </div>
              {newContent.links.map((link, index) => (
                <div key={index} className="border p-3 rounded-lg space-y-2 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Link {index + 1}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeLink(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Título do link"
                    value={link.title}
                    onChange={(e) => updateLink(index, "title", e.target.value)}
                  />
                  <Input
                    placeholder="URL do link"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                  />
                  <Input
                    placeholder="Descrição do link"
                    value={link.description}
                    onChange={(e) => updateLink(index, "description", e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddingContent(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddContent}>Adicionar Conteúdo</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={!!editingContent} onOpenChange={() => setEditingContent(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Conteúdo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                value={newContent.title}
                onChange={(e) => setNewContent((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Título do conteúdo"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={newContent.description}
                onChange={(e) => setNewContent((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do conteúdo"
              />
            </div>
            <div>
              <Label htmlFor="edit-link">Link Principal</Label>
              <Input
                id="edit-link"
                value={newContent.link}
                onChange={(e) => setNewContent((prev) => ({ ...prev, link: e.target.value }))}
                placeholder="URL do conteúdo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-type">Tipo</Label>
                <Select
                  value={newContent.type}
                  onValueChange={(value: any) => setNewContent((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Vídeo</SelectItem>
                    <SelectItem value="document">Documento</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="interactive">Interativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-duration">Duração (min)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={newContent.duration}
                  onChange={(e) =>
                    setNewContent((prev) => ({ ...prev, duration: Number.parseInt(e.target.value) || 5 }))
                  }
                />
              </div>
            </div>
            <div>
              <Label>Planos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {availablePlans.map((plan) => (
                  <div key={plan} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-plan-${plan}`}
                      checked={newContent.plans.includes(plan)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setNewContent((prev) => ({ ...prev, plans: [...prev.plans, plan] }))
                        } else {
                          setNewContent((prev) => ({ ...prev, plans: prev.plans.filter((p) => p !== plan) }))
                        }
                      }}
                    />
                    <Label htmlFor={`edit-plan-${plan}`} className="text-sm">
                      {plan}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Adicionais para Edição */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Links Adicionais</Label>
                <Button type="button" size="sm" variant="outline" onClick={addLink}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Link
                </Button>
              </div>
              {newContent.links.map((link, index) => (
                <div key={index} className="border p-3 rounded-lg space-y-2 mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Link {index + 1}</span>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeLink(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Título do link"
                    value={link.title}
                    onChange={(e) => updateLink(index, "title", e.target.value)}
                  />
                  <Input
                    placeholder="URL do link"
                    value={link.url}
                    onChange={(e) => updateLink(index, "url", e.target.value)}
                  />
                  <Input
                    placeholder="Descrição do link"
                    value={link.description}
                    onChange={(e) => updateLink(index, "description", e.target.value)}
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingContent(null)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateContent}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
