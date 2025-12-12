import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute, useSearch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { proposalsApi, customersApi, proposalTemplatesApi } from "@/lib/api";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Plus,
  GripVertical,
  Trash2,
  Sparkles,
  FileText,
  Type,
  CheckSquare,
  Clock,
  DollarSign,
  Quote,
  Users,
  Wand2,
} from "lucide-react";

const sectionTypes = [
  { id: "cover", label: "Cover Page", icon: FileText },
  { id: "introduction", label: "Introduction", icon: Type },
  { id: "executive_summary", label: "Executive Summary", icon: FileText },
  { id: "scope_of_work", label: "Scope of Work", icon: CheckSquare },
  { id: "timeline", label: "Timeline", icon: Clock },
  { id: "pricing", label: "Pricing Table", icon: DollarSign },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "team", label: "Team", icon: Users },
  { id: "terms", label: "Terms & Conditions", icon: FileText },
  { id: "custom", label: "Custom Section", icon: Type },
];

export default function ProposalBuilder() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/proposals/edit/:id");
  const searchString = useSearch();
  const proposalId = params?.id;
  const isEditing = !!proposalId;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get templateId from query params
  const urlParams = new URLSearchParams(searchString);
  const templateId = urlParams.get("templateId");

  const [title, setTitle] = useState("");
  const [customerId, setCustomerId] = useState<string>("");
  const [currency, setCurrency] = useState("USD");
  const [validUntil, setValidUntil] = useState("");
  const [sections, setSections] = useState<any[]>([]);
  const [pricingItems, setPricingItems] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [showAddSection, setShowAddSection] = useState(false);
  const [templateLoaded, setTemplateLoaded] = useState(false);

  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const { data: proposal, isLoading } = useQuery({
    queryKey: ["proposal", proposalId],
    queryFn: () => proposalsApi.getById(proposalId!),
    enabled: isEditing,
  });

  // Fetch template if templateId is provided
  const { data: template, isLoading: templateLoading } = useQuery({
    queryKey: ["proposal-template", templateId],
    queryFn: () => proposalTemplatesApi.getById(templateId!),
    enabled: !!templateId && !isEditing && !templateLoaded,
  });

  // Load template data when creating new proposal from template
  useEffect(() => {
    if (template && !isEditing && !templateLoaded) {
      setTitle(template.name || "New Proposal");
      // Load template sections
      if (template.sections && template.sections.length > 0) {
        const templateSections = template.sections.map((s: any, index: number) => ({
          sectionType: s.sectionType || "custom",
          title: s.title || "Untitled Section",
          content: s.content || "",
          sortOrder: index,
          isVisible: s.isVisible !== false,
          isLocked: s.isLocked || false,
        }));
        setSections(templateSections);
      }
      setTemplateLoaded(true);
      toast({ title: "Template loaded", description: `Using template: ${template.name}` });
    }
  }, [template, isEditing, templateLoaded, toast]);

  useEffect(() => {
    if (proposal) {
      setTitle(proposal.title);
      setCustomerId(proposal.customerId || "");
      setCurrency(proposal.currency);
      setValidUntil(proposal.validUntil ? proposal.validUntil.split("T")[0] : "");
      setSections(proposal.sections || []);
      setPricingItems(proposal.pricingItems || []);
    }
  }, [proposal]);

  const createMutation = useMutation({
    mutationFn: proposalsApi.create,
    onSuccess: (data: any) => {
      queryClient.setQueryData(["proposal", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ title: "Proposal created successfully" });
      setLocation(`/proposals/edit/${data.id}`);
    },
    onError: () => {
      toast({ title: "Failed to create proposal", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => proposalsApi.update(proposalId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
      toast({ title: "Proposal saved" });
    },
    onError: () => {
      toast({ title: "Failed to save proposal", variant: "destructive" });
    },
  });

  const sectionMutation = useMutation({
    mutationFn: (data: any) => {
      if (data.id) {
        return proposalsApi.updateSection(data.id, data);
      }
      return proposalsApi.createSection(proposalId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: proposalsApi.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
    },
  });

  const pricingMutation = useMutation({
    mutationFn: (data: any) => {
      if (data.id) {
        return proposalsApi.updatePricingItem(data.id, data);
      }
      return proposalsApi.createPricingItem(proposalId!, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
    },
  });

  const aiMutation = useMutation({
    mutationFn: proposalsApi.aiAssist,
    onSuccess: (data: any, variables) => {
      toast({ title: "Content generated successfully" });
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => proposalsApi.send(proposalId!),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
      toast({
        title: "Proposal sent successfully",
        description: `Share URL: ${window.location.origin}${data.shareUrl}`,
      });
    },
  });

  const handleSave = () => {
    const data: any = {
      title,
      customerId: customerId || null,
      currency,
      validUntil: validUntil || null,
    };

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      // Include staged sections and pricing items when creating
      data.sections = sections.filter(s => !s.id).map((s, i) => ({
        sectionType: s.sectionType || "custom",
        title: s.title || "Untitled Section",
        content: s.content || "",
        sortOrder: i,
        isVisible: true,
        isLocked: false,
      }));
      data.pricingItems = pricingItems.filter(p => !p.id).map((p, i) => ({
        name: p.name || "Item",
        description: p.description || "",
        quantity: String(Number(p.quantity) || 1),
        unitPrice: String(Number(p.unitPrice) || 0),
        discountPercent: String(Number(p.discountPercent) || 0),
        totalPrice: String(Number(p.totalPrice) || 0),
        sortOrder: i,
      }));
      createMutation.mutate(data);
    }
  };

  const handleAddSection = (type: string) => {
    const typeConfig = sectionTypes.find((t) => t.id === type);
    const newSection = {
      sectionType: type,
      title: typeConfig?.label || "New Section",
      content: "",
      sortOrder: sections.length,
      isVisible: true,
    };

    if (isEditing && proposalId) {
      sectionMutation.mutate(newSection);
    }
    setSections([...sections, newSection]);
    setShowAddSection(false);
  };

  const handleSectionChange = (index: number, field: string, value: string) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const handleSectionBlur = (index: number) => {
    const section = sections[index];
    if (section.id) {
      sectionMutation.mutate({
        id: section.id,
        title: section.title,
        content: section.content,
      });
    }
  };

  const handleDeleteSection = (index: number) => {
    const section = sections[index];
    if (section.id) {
      deleteSectionMutation.mutate(section.id);
    }
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleAIGenerate = async (action: string, index: number) => {
    const section = sections[index];
    const result = await aiMutation.mutateAsync({
      action,
      content: section?.content || "",
      context: { projectName: title },
    });
    
    if (result && index < sections.length) {
      const updatedSections = [...sections];
      updatedSections[index] = {
        ...updatedSections[index],
        content: result.result,
      };
      setSections(updatedSections);
      
      if (updatedSections[index].id) {
        sectionMutation.mutate({
          id: updatedSections[index].id,
          content: result.result,
        });
      }
    }
  };

  const handleAddPricingItem = () => {
    const newItem = {
      name: "New Item",
      description: "",
      quantity: "1",
      unitPrice: "0",
      discountPercent: "0",
      totalPrice: "0",
      sortOrder: pricingItems.length,
    };

    if (isEditing && proposalId) {
      pricingMutation.mutate(newItem);
    }
    setPricingItems([...pricingItems, newItem]);
  };

  const handlePricingChange = (index: number, field: string, value: string) => {
    const updatedItems = [...pricingItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    if (field === "quantity" || field === "unitPrice" || field === "discountPercent") {
      const qty = parseFloat(updatedItems[index].quantity || "0");
      const price = parseFloat(updatedItems[index].unitPrice || "0");
      const discount = parseFloat(updatedItems[index].discountPercent || "0");
      const total = qty * price * (1 - discount / 100);
      updatedItems[index].totalPrice = total.toFixed(2);
    }
    
    setPricingItems(updatedItems);
  };

  const handlePricingBlur = (index: number) => {
    const item = pricingItems[index];
    if (item.id) {
      pricingMutation.mutate(item);
    }
  };

  const calculateSubtotal = () => {
    return pricingItems.reduce((sum, item) => sum + parseFloat(item.totalPrice || "0"), 0);
  };

  if (isEditing && isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading proposal...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/proposals")} data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-page-title">
                {isEditing ? "Edit Proposal" : "New Proposal"}
              </h1>
              {proposal && (
                <Badge variant="secondary">{proposal.proposalNumber}</Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(`/proposal/view/${proposalId}`, "_blank")} disabled={!isEditing} data-testid="button-preview">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleSave} data-testid="button-save">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            {isEditing && proposal?.status === "draft" && (
              <Button onClick={() => sendMutation.mutate()} data-testid="button-send">
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Proposal Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter proposal title"
                      data-testid="input-title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer">Customer</Label>
                    <Select value={customerId} onValueChange={setCustomerId}>
                      <SelectTrigger data-testid="select-customer">
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c: any) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} {c.company && `(${c.company})`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger data-testid="select-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="INR">INR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="validUntil">Valid Until</Label>
                    <Input
                      id="validUntil"
                      type="date"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      data-testid="input-valid-until"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="content" data-testid="tab-content">Content Sections</TabsTrigger>
                <TabsTrigger value="pricing" data-testid="tab-pricing">Pricing</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4 mt-4">
                {sections.map((section, index) => (
                  <Card key={section.id || index}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                          <Input
                            value={section.title || ""}
                            onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                            onBlur={() => handleSectionBlur(index)}
                            className="font-semibold border-none shadow-none p-0 h-auto"
                            data-testid={`input-section-title-${index}`}
                          />
                          <Badge variant="secondary" className="text-xs">
                            {section.sectionType}
                          </Badge>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAIGenerate("generate_" + section.sectionType, index)}
                            data-testid={`button-ai-${index}`}
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            AI
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSection(index)}
                            data-testid={`button-delete-section-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={section.content || ""}
                        onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                        onBlur={() => handleSectionBlur(index)}
                        placeholder="Enter section content..."
                        className="min-h-[150px]"
                        data-testid={`textarea-section-content-${index}`}
                      />
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAddSection(true)}
                  data-testid="button-add-section"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </TabsContent>

              <TabsContent value="pricing" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Pricing Table</CardTitle>
                      <Button size="sm" onClick={handleAddPricingItem} data-testid="button-add-item">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pricingItems.map((item, index) => (
                        <div key={item.id || index} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-4">
                            <Input
                              value={item.name || ""}
                              onChange={(e) => handlePricingChange(index, "name", e.target.value)}
                              onBlur={() => handlePricingBlur(index)}
                              placeholder="Item name"
                              data-testid={`input-item-name-${index}`}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={item.quantity || ""}
                              onChange={(e) => handlePricingChange(index, "quantity", e.target.value)}
                              onBlur={() => handlePricingBlur(index)}
                              placeholder="Qty"
                              data-testid={`input-item-qty-${index}`}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={item.unitPrice || ""}
                              onChange={(e) => handlePricingChange(index, "unitPrice", e.target.value)}
                              onBlur={() => handlePricingBlur(index)}
                              placeholder="Price"
                              data-testid={`input-item-price-${index}`}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input
                              type="number"
                              value={item.discountPercent || ""}
                              onChange={(e) => handlePricingChange(index, "discountPercent", e.target.value)}
                              onBlur={() => handlePricingBlur(index)}
                              placeholder="Disc %"
                              data-testid={`input-item-discount-${index}`}
                            />
                          </div>
                          <div className="col-span-2 text-right font-semibold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency,
                            }).format(parseFloat(item.totalPrice || "0"))}
                          </div>
                        </div>
                      ))}

                      {pricingItems.length > 0 && (
                        <>
                          <Separator className="my-4" />
                          <div className="flex justify-end">
                            <div className="w-48 space-y-2">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold" data-testid="text-subtotal">
                                  {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency,
                                  }).format(calculateSubtotal())}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Use AI to help generate proposal content
                </p>
                <Button variant="outline" className="w-full justify-start" onClick={() => sections.length > 0 && handleAIGenerate("generate_introduction", 0)} disabled={sections.length === 0}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Introduction
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => sections.length > 0 && handleAIGenerate("generate_scope", 0)} disabled={sections.length === 0}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Scope of Work
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => sections.length > 0 && handleAIGenerate("generate_timeline", 0)} disabled={sections.length === 0}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Timeline
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => sections.length > 0 && handleAIGenerate("generate_terms", 0)} disabled={sections.length === 0}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Terms
                </Button>
              </CardContent>
            </Card>

            {proposal && (
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge>{proposal.status}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sections</span>
                    <span>{sections.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Line Items</span>
                    <span>{pricingItems.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span data-testid="text-total">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency,
                      }).format(calculateSubtotal())}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>Choose a section type to add to your proposal</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {sectionTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className="justify-start h-auto py-3"
                onClick={() => handleAddSection(type.id)}
                data-testid={`button-add-${type.id}`}
              >
                <type.icon className="w-4 h-4 mr-2" />
                {type.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
