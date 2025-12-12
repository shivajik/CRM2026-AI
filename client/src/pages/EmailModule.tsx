import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { emailApi, customersApi } from "@/lib/api";
import { 
  Mail, FileText, Zap, RefreshCw, Clock, Send, Plus, Trash2, Edit, Eye, 
  Wand2, Copy, ChevronRight, CheckCircle, XCircle, Clock3, AlertCircle,
  Users, Building2, FileCheck, Receipt, Calendar, ChevronUp, ChevronDown,
  Lock, Share2, User, Globe, Layers
} from "lucide-react";
import { format } from "date-fns";

type EmailTemplate = {
  id: string;
  name: string;
  purpose: string;
  subject: string;
  body: string;
  mergeFields: string[];
  isDefault: boolean;
  defaultFor: string | null;
  isActive: boolean;
  createdAt: string;
  ownerType?: 'system' | 'workspace' | 'user';
  ownerId?: string | null;
  isShared?: boolean;
  createdBy?: string;
};

type GroupedTemplates = {
  userTemplates: EmailTemplate[];
  sharedTemplates: EmailTemplate[];
  workspaceTemplates: EmailTemplate[];
  systemTemplates: EmailTemplate[];
};

type EmailLog = {
  id: string;
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
  status: string;
  sentAt: string | null;
  openedAt: string | null;
  createdAt: string;
};

type AutomationRule = {
  id: string;
  name: string;
  description: string | null;
  trigger: string;
  templateId: string;
  delayValue: number;
  delayUnit: string;
  isEnabled: boolean;
  triggerCount: number;
  createdAt: string;
};

type FollowUpSequence = {
  id: string;
  name: string;
  description: string | null;
  purpose: string;
  isEnabled: boolean;
  createdAt: string;
  steps?: FollowUpStep[];
};

type FollowUpStep = {
  id: string;
  sequenceId: string;
  templateId: string;
  stepOrder: number;
  delayDays: number;
};

type Customer = {
  id: string;
  name: string;
  email: string;
};

type MergeFieldCategory = {
  category: string;
  fields: { key: string; label: string }[];
};

const purposeOptions = [
  { value: "quotation", label: "Quotation Email" },
  { value: "invoice", label: "Invoice Email" },
  { value: "payment_reminder", label: "Payment Reminder" },
  { value: "follow_up", label: "Follow-up" },
  { value: "welcome", label: "Welcome/Onboarding" },
  { value: "renewal", label: "Renewal Reminder" },
  { value: "feedback", label: "Feedback Request" },
  { value: "meeting", label: "Meeting" },
  { value: "custom", label: "Custom" },
];

const triggerOptions = [
  { value: "quotation_created", label: "When quotation is created" },
  { value: "quotation_sent", label: "When quotation is sent" },
  { value: "quotation_not_accepted", label: "Quotation not accepted (X days)" },
  { value: "invoice_created", label: "When invoice is created" },
  { value: "invoice_sent", label: "When invoice is sent" },
  { value: "invoice_overdue", label: "When invoice is overdue" },
  { value: "customer_status_change", label: "Customer status changes" },
];

const statusColors: Record<string, string> = {
  sent: "bg-green-100 text-green-800",
  delivered: "bg-green-100 text-green-800",
  opened: "bg-blue-100 text-blue-800",
  clicked: "bg-purple-100 text-purple-800",
  pending: "bg-yellow-100 text-yellow-800",
  scheduled: "bg-orange-100 text-orange-800",
  failed: "bg-red-100 text-red-800",
  bounced: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  sent: <CheckCircle className="w-4 h-4" />,
  delivered: <CheckCircle className="w-4 h-4" />,
  opened: <Eye className="w-4 h-4" />,
  clicked: <ChevronRight className="w-4 h-4" />,
  pending: <Clock3 className="w-4 h-4" />,
  scheduled: <Calendar className="w-4 h-4" />,
  failed: <XCircle className="w-4 h-4" />,
  bounced: <AlertCircle className="w-4 h-4" />,
};

export default function EmailModule() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("compose");
  
  // Compose state
  const [composeData, setComposeData] = useState({
    toEmail: "",
    ccEmails: "",
    bccEmails: "",
    subject: "",
    body: "",
    templateId: "",
    customerId: "",
  });
  const [showMergeFields, setShowMergeFields] = useState(false);
  
  // Template state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: "",
    purpose: "custom",
    subject: "",
    body: "",
    isDefault: false,
    defaultFor: "",
  });
  
  // Automation state
  const [automationDialogOpen, setAutomationDialogOpen] = useState(false);
  const [automationForm, setAutomationForm] = useState({
    name: "",
    description: "",
    trigger: "",
    templateId: "",
    delayValue: 0,
    delayUnit: "minutes",
    isEnabled: true,
  });
  
  // Sequence state
  const [sequenceDialogOpen, setSequenceDialogOpen] = useState(false);
  const [sequenceForm, setSequenceForm] = useState({
    name: "",
    description: "",
    purpose: "general",
    isEnabled: true,
  });
  
  // Step Designer state
  const [designerDialogOpen, setDesignerDialogOpen] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<FollowUpSequence | null>(null);
  const [stepForm, setStepForm] = useState({
    templateId: "",
    delayDays: 0,
  });
  const [editingStep, setEditingStep] = useState<FollowUpStep | null>(null);
  const [stepOperationPending, setStepOperationPending] = useState(false);
  
  // Preview state
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewContent, setPreviewContent] = useState({ subject: "", body: "" });

  // Queries
  const { data: templates = [] } = useQuery<EmailTemplate[]>({
    queryKey: ["emailTemplates"],
    queryFn: emailApi.getTemplates,
  });

  const { data: groupedTemplates } = useQuery<GroupedTemplates>({
    queryKey: ["emailTemplatesGrouped"],
    queryFn: emailApi.getTemplatesGrouped,
  });

  const { data: logs = [] } = useQuery<EmailLog[]>({
    queryKey: ["emailLogs"],
    queryFn: emailApi.getLogs,
  });

  const { data: automations = [] } = useQuery<AutomationRule[]>({
    queryKey: ["emailAutomations"],
    queryFn: emailApi.getAutomations,
  });

  const { data: sequences = [] } = useQuery<FollowUpSequence[]>({
    queryKey: ["emailSequences"],
    queryFn: emailApi.getSequences,
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  });

  const { data: mergeFields = [] } = useQuery<MergeFieldCategory[]>({
    queryKey: ["mergeFields"],
    queryFn: emailApi.getMergeFields,
  });

  // Mutations
  const sendEmailMutation = useMutation({
    mutationFn: (data: typeof composeData) => emailApi.send(data),
    onSuccess: () => {
      toast({ title: "Email sent successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailLogs"] });
      setComposeData({ toEmail: "", ccEmails: "", bccEmails: "", subject: "", body: "", templateId: "", customerId: "" });
    },
    onError: () => {
      toast({ title: "Failed to send email", variant: "destructive" });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: (data: typeof templateForm) => emailApi.createTemplate(data),
    onSuccess: () => {
      toast({ title: "Template created successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setTemplateDialogOpen(false);
      resetTemplateForm();
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof templateForm }) => 
      emailApi.updateTemplate(id, data),
    onSuccess: () => {
      toast({ title: "Template updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      setTemplateDialogOpen(false);
      resetTemplateForm();
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (id: string) => emailApi.deleteTemplate(id),
    onSuccess: () => {
      toast({ title: "Template deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["emailTemplatesGrouped"] });
    },
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: (id: string) => emailApi.duplicateTemplate(id),
    onSuccess: () => {
      toast({ title: "Template duplicated to your personal templates" });
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["emailTemplatesGrouped"] });
    },
    onError: () => {
      toast({ title: "Failed to duplicate template", variant: "destructive" });
    },
  });

  const shareTemplateMutation = useMutation({
    mutationFn: ({ id, isShared }: { id: string; isShared: boolean }) => 
      emailApi.shareTemplate(id, isShared),
    onSuccess: (_, variables) => {
      toast({ title: variables.isShared ? "Template shared with team" : "Template made private" });
      queryClient.invalidateQueries({ queryKey: ["emailTemplates"] });
      queryClient.invalidateQueries({ queryKey: ["emailTemplatesGrouped"] });
    },
    onError: () => {
      toast({ title: "Failed to update sharing settings", variant: "destructive" });
    },
  });

  const createAutomationMutation = useMutation({
    mutationFn: (data: typeof automationForm) => emailApi.createAutomation(data),
    onSuccess: () => {
      toast({ title: "Automation rule created successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailAutomations"] });
      setAutomationDialogOpen(false);
      resetAutomationForm();
    },
  });

  const toggleAutomationMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      emailApi.updateAutomation(id, { isEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailAutomations"] });
    },
  });

  const deleteAutomationMutation = useMutation({
    mutationFn: (id: string) => emailApi.deleteAutomation(id),
    onSuccess: () => {
      toast({ title: "Automation rule deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailAutomations"] });
    },
  });

  const createSequenceMutation = useMutation({
    mutationFn: (data: typeof sequenceForm) => emailApi.createSequence(data),
    onSuccess: () => {
      toast({ title: "Follow-up sequence created successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
      setSequenceDialogOpen(false);
      resetSequenceForm();
    },
  });

  const toggleSequenceMutation = useMutation({
    mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      emailApi.updateSequence(id, { isEnabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
    },
  });

  const deleteSequenceMutation = useMutation({
    mutationFn: (id: string) => emailApi.deleteSequence(id),
    onSuccess: () => {
      toast({ title: "Follow-up sequence deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["emailSequences"] });
    },
  });

  const createStepMutation = useMutation({
    mutationFn: async ({ sequenceId, data }: { sequenceId: string; data: typeof stepForm }) => {
      setStepOperationPending(true);
      await queryClient.refetchQueries({ queryKey: ["emailSequences"] });
      const freshSequences = queryClient.getQueryData<FollowUpSequence[]>(["emailSequences"]);
      const freshSequence = freshSequences?.find(s => s.id === sequenceId);
      const maxOrder = freshSequence?.steps?.length ? Math.max(...freshSequence.steps.map(s => s.stepOrder)) : 0;
      return emailApi.createStep(sequenceId, { ...data, stepOrder: maxOrder + 1 });
    },
    onSuccess: async () => {
      toast({ title: "Step added successfully" });
      await queryClient.refetchQueries({ queryKey: ["emailSequences"] });
      const updatedSequences = queryClient.getQueryData<FollowUpSequence[]>(["emailSequences"]);
      if (selectedSequence && updatedSequences) {
        const updated = updatedSequences.find(s => s.id === selectedSequence.id);
        if (updated) setSelectedSequence(updated);
      }
      setStepForm({ templateId: "", delayDays: 0 });
      setStepOperationPending(false);
    },
    onError: () => {
      setStepOperationPending(false);
    },
  });

  const deleteStepMutation = useMutation({
    mutationFn: async (id: string) => {
      setStepOperationPending(true);
      return emailApi.deleteStep(id);
    },
    onSuccess: async () => {
      toast({ title: "Step removed successfully" });
      await queryClient.refetchQueries({ queryKey: ["emailSequences"] });
      let updatedSequences = queryClient.getQueryData<FollowUpSequence[]>(["emailSequences"]);
      if (selectedSequence && updatedSequences) {
        let updated = updatedSequences.find(s => s.id === selectedSequence.id);
        if (updated) {
          if (updated.steps && updated.steps.length > 0) {
            const sortedSteps = [...updated.steps].sort((a, b) => a.stepOrder - b.stepOrder);
            const needsNormalization = sortedSteps.some((step, idx) => step.stepOrder !== idx + 1);
            if (needsNormalization) {
              await Promise.all(sortedSteps.map((step, idx) => 
                emailApi.updateStep(step.id, { stepOrder: idx + 1 })
              ));
              await queryClient.refetchQueries({ queryKey: ["emailSequences"] });
              updatedSequences = queryClient.getQueryData<FollowUpSequence[]>(["emailSequences"]);
              updated = updatedSequences?.find(s => s.id === selectedSequence.id);
            }
          }
          if (updated) setSelectedSequence(updated);
        }
      }
      setStepOperationPending(false);
    },
    onError: () => {
      setStepOperationPending(false);
    },
  });

  const updateStepMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { templateId?: string; delayDays?: number; stepOrder?: number } }) => {
      setStepOperationPending(true);
      return emailApi.updateStep(id, data);
    },
    onSuccess: async () => {
      toast({ title: "Step updated successfully" });
      await queryClient.refetchQueries({ queryKey: ["emailSequences"] });
      const updatedSequences = queryClient.getQueryData<FollowUpSequence[]>(["emailSequences"]);
      if (selectedSequence && updatedSequences) {
        const updated = updatedSequences.find(s => s.id === selectedSequence.id);
        if (updated) setSelectedSequence(updated);
      }
      setEditingStep(null);
      setStepForm({ templateId: "", delayDays: 0 });
      setStepOperationPending(false);
    },
    onError: () => {
      setStepOperationPending(false);
    },
  });

  const aiAssistMutation = useMutation({
    mutationFn: ({ action, content }: { action: string; content: string }) =>
      emailApi.aiAssist({ action, content }),
    onSuccess: (response: { result: string }) => {
      setComposeData(prev => ({ ...prev, body: response.result }));
      toast({ title: "AI suggestion applied" });
    },
  });

  // Helper functions
  const resetTemplateForm = () => {
    setTemplateForm({ name: "", purpose: "custom", subject: "", body: "", isDefault: false, defaultFor: "" });
    setEditingTemplate(null);
  };

  const resetAutomationForm = () => {
    setAutomationForm({ name: "", description: "", trigger: "", templateId: "", delayValue: 0, delayUnit: "minutes", isEnabled: true });
  };

  const resetSequenceForm = () => {
    setSequenceForm({ name: "", description: "", purpose: "general", isEnabled: true });
  };

  const openStepDesigner = (sequence: FollowUpSequence) => {
    setSelectedSequence(sequence);
    setDesignerDialogOpen(true);
    setStepForm({ templateId: "", delayDays: 0 });
    setEditingStep(null);
  };

  const getTemplateName = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template?.name || "Unknown Template";
  };

  const startEditingStep = (step: FollowUpStep) => {
    setEditingStep(step);
    setStepForm({ templateId: step.templateId, delayDays: step.delayDays });
  };

  const cancelEditingStep = () => {
    setEditingStep(null);
    setStepForm({ templateId: "", delayDays: 0 });
  };

  const moveStep = async (step: FollowUpStep, direction: "up" | "down") => {
    if (!selectedSequence?.steps || stepOperationPending) return;
    setStepOperationPending(true);
    try {
      const sortedSteps = [...selectedSequence.steps].sort((a, b) => a.stepOrder - b.stepOrder);
      const currentIndex = sortedSteps.findIndex(s => s.id === step.id);
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sortedSteps.length) {
        setStepOperationPending(false);
        return;
      }
      
      const targetStep = sortedSteps[targetIndex];
      await Promise.all([
        emailApi.updateStep(step.id, { stepOrder: targetStep.stepOrder }),
        emailApi.updateStep(targetStep.id, { stepOrder: step.stepOrder }),
      ]);
      await queryClient.refetchQueries({ queryKey: ["emailSequences"] });
      const updatedSequences = queryClient.getQueryData<FollowUpSequence[]>(["emailSequences"]);
      if (updatedSequences) {
        const updated = updatedSequences.find(s => s.id === selectedSequence.id);
        if (updated) setSelectedSequence(updated);
      }
    } finally {
      setStepOperationPending(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setComposeData(prev => ({
        ...prev,
        templateId,
        subject: template.subject,
        body: template.body,
      }));
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setComposeData(prev => ({
        ...prev,
        customerId,
        toEmail: customer.email,
      }));
    }
  };

  const insertMergeField = (field: string) => {
    setComposeData(prev => ({
      ...prev,
      body: prev.body + field,
    }));
  };

  const handleSendEmail = () => {
    if (!composeData.toEmail || !composeData.subject || !composeData.body) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    sendEmailMutation.mutate(composeData);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setTemplateForm({
      name: template.name,
      purpose: template.purpose,
      subject: template.subject,
      body: template.body,
      isDefault: template.isDefault,
      defaultFor: template.defaultFor || "",
    });
    setTemplateDialogOpen(true);
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      updateTemplateMutation.mutate({ id: editingTemplate.id, data: templateForm });
    } else {
      createTemplateMutation.mutate(templateForm);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Email Communication</h1>
          <p className="text-muted-foreground mt-1">
            Compose emails, manage templates, and configure automated communications
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="compose" className="flex items-center gap-2" data-testid="tab-compose">
              <Mail className="w-4 h-4" /> Compose
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2" data-testid="tab-templates">
              <FileText className="w-4 h-4" /> Templates
            </TabsTrigger>
            <TabsTrigger value="automations" className="flex items-center gap-2" data-testid="tab-automations">
              <Zap className="w-4 h-4" /> Automations
            </TabsTrigger>
            <TabsTrigger value="followups" className="flex items-center gap-2" data-testid="tab-followups">
              <RefreshCw className="w-4 h-4" /> Follow-ups
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2" data-testid="tab-logs">
              <Clock className="w-4 h-4" /> Logs
            </TabsTrigger>
          </TabsList>

          {/* COMPOSE TAB */}
          <TabsContent value="compose">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" /> Compose Email
                    </CardTitle>
                    <CardDescription>
                      Create and send emails with dynamic merge fields
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Customer</Label>
                        <Select value={composeData.customerId} onValueChange={handleCustomerSelect}>
                          <SelectTrigger data-testid="select-customer">
                            <SelectValue placeholder="Select customer..." />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.map(customer => (
                              <SelectItem key={customer.id} value={customer.id}>
                                {customer.name} ({customer.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Template</Label>
                        <Select value={composeData.templateId} onValueChange={handleTemplateSelect}>
                          <SelectTrigger data-testid="select-template">
                            <SelectValue placeholder="Select template..." />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>To *</Label>
                      <Input
                        value={composeData.toEmail}
                        onChange={(e) => setComposeData(prev => ({ ...prev, toEmail: e.target.value }))}
                        placeholder="recipient@example.com"
                        data-testid="input-to-email"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>CC</Label>
                        <Input
                          value={composeData.ccEmails}
                          onChange={(e) => setComposeData(prev => ({ ...prev, ccEmails: e.target.value }))}
                          placeholder="cc@example.com"
                          data-testid="input-cc-emails"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>BCC</Label>
                        <Input
                          value={composeData.bccEmails}
                          onChange={(e) => setComposeData(prev => ({ ...prev, bccEmails: e.target.value }))}
                          placeholder="bcc@example.com"
                          data-testid="input-bcc-emails"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject *</Label>
                      <Input
                        value={composeData.subject}
                        onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Email subject..."
                        data-testid="input-subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Body *</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowMergeFields(!showMergeFields)}
                          data-testid="button-toggle-merge-fields"
                        >
                          <Copy className="w-4 h-4 mr-1" /> Insert Merge Field
                        </Button>
                      </div>
                      <Textarea
                        value={composeData.body}
                        onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Write your email content..."
                        rows={10}
                        data-testid="input-body"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">AI Assistant:</span>
                        {["improve_tone", "shorten", "make_persuasive", "formal", "friendly"].map(action => (
                          <Button
                            key={action}
                            variant="outline"
                            size="sm"
                            onClick={() => aiAssistMutation.mutate({ action, content: composeData.body })}
                            disabled={!composeData.body || aiAssistMutation.isPending}
                            data-testid={`button-ai-${action}`}
                          >
                            <Wand2 className="w-3 h-3 mr-1" />
                            {action.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </Button>
                        ))}
                      </div>
                      <Button 
                        onClick={handleSendEmail} 
                        disabled={sendEmailMutation.isPending}
                        data-testid="button-send-email"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {sendEmailMutation.isPending ? "Sending..." : "Send Email"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Merge Fields Panel */}
              <div className={`lg:col-span-1 ${showMergeFields ? '' : 'hidden lg:block'}`}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Merge Fields</CardTitle>
                    <CardDescription className="text-xs">Click to insert into email body</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      {mergeFields.map((category) => (
                        <div key={category.category} className="mb-4">
                          <h4 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                            {category.category === "Client" && <Users className="w-3 h-3" />}
                            {category.category === "Agency" && <Building2 className="w-3 h-3" />}
                            {category.category === "Quotation" && <FileCheck className="w-3 h-3" />}
                            {category.category === "Invoice" && <Receipt className="w-3 h-3" />}
                            {category.category}
                          </h4>
                          <div className="space-y-1">
                            {category.fields.map((field) => (
                              <Button
                                key={field.key}
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-xs h-7"
                                onClick={() => insertMergeField(field.key)}
                                data-testid={`button-merge-field-${field.key}`}
                              >
                                <code className="text-primary">{field.key}</code>
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TEMPLATES TAB */}
          <TabsContent value="templates">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>Create and manage reusable email templates organized by ownership</CardDescription>
                </div>
                <Dialog open={templateDialogOpen} onOpenChange={(open) => { setTemplateDialogOpen(open); if (!open) resetTemplateForm(); }}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-template">
                      <Plus className="w-4 h-4 mr-2" /> Create Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingTemplate ? "Edit Template" : "Create Email Template"}</DialogTitle>
                      <DialogDescription>
                        Define the template content with merge fields for personalization
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Template Name *</Label>
                          <Input
                            value={templateForm.name}
                            onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Quotation Follow-up"
                            data-testid="input-template-name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Purpose</Label>
                          <Select value={templateForm.purpose} onValueChange={(v) => setTemplateForm(prev => ({ ...prev, purpose: v }))}>
                            <SelectTrigger data-testid="select-template-purpose">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {purposeOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject *</Label>
                        <Input
                          value={templateForm.subject}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Email subject with {{merge.fields}}"
                          data-testid="input-template-subject"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Body *</Label>
                        <Textarea
                          value={templateForm.body}
                          onChange={(e) => setTemplateForm(prev => ({ ...prev, body: e.target.value }))}
                          placeholder="Email body content..."
                          rows={8}
                          data-testid="input-template-body"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={templateForm.isDefault}
                            onCheckedChange={(checked) => setTemplateForm(prev => ({ ...prev, isDefault: checked }))}
                            data-testid="switch-template-default"
                          />
                          <Label>Set as default</Label>
                        </div>
                        {templateForm.isDefault && (
                          <Select value={templateForm.defaultFor} onValueChange={(v) => setTemplateForm(prev => ({ ...prev, defaultFor: v }))}>
                            <SelectTrigger className="w-48" data-testid="select-template-default-for">
                              <SelectValue placeholder="Default for..." />
                            </SelectTrigger>
                            <SelectContent>
                              {purposeOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleSaveTemplate} disabled={!templateForm.name || !templateForm.subject || !templateForm.body} data-testid="button-save-template">
                        {editingTemplate ? "Update Template" : "Create Template"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {!groupedTemplates || (groupedTemplates.userTemplates.length === 0 && groupedTemplates.sharedTemplates.length === 0 && groupedTemplates.workspaceTemplates.length === 0 && groupedTemplates.systemTemplates.length === 0) ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No templates yet. Create your first email template to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* MY TEMPLATES */}
                    {(groupedTemplates?.userTemplates?.length ?? 0) > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-blue-500" />
                          <h3 className="font-semibold text-lg">My Templates</h3>
                          <Badge variant="secondary" className="ml-2">{groupedTemplates.userTemplates.length}</Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {groupedTemplates.userTemplates.map((template) => (
                            <Card key={template.id} className="relative border-blue-200 dark:border-blue-800" data-testid={`card-template-${template.id}`}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                      {purposeOptions.find(p => p.value === template.purpose)?.label || template.purpose}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    {template.isDefault && <Badge className="bg-primary">Default</Badge>}
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">{template.subject}</p>
                              </CardContent>
                              <div className="p-4 pt-0 flex gap-2 flex-wrap">
                                <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)} data-testid={`button-edit-template-${template.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setPreviewContent({ subject: template.subject, body: template.body }); setPreviewDialogOpen(true); }} data-testid={`button-preview-template-${template.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => shareTemplateMutation.mutate({ id: template.id, isShared: !template.isShared })}
                                  className={template.isShared ? "text-green-600" : ""}
                                  title={template.isShared ? "Shared with team - click to make private" : "Private - click to share"}
                                  data-testid={`button-share-template-${template.id}`}
                                >
                                  <Share2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteTemplateMutation.mutate(template.id)} data-testid={`button-delete-template-${template.id}`}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SHARED TEMPLATES */}
                    {(groupedTemplates?.sharedTemplates?.length ?? 0) > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Share2 className="w-5 h-5 text-green-500" />
                          <h3 className="font-semibold text-lg">Shared by Team</h3>
                          <Badge variant="secondary" className="ml-2">{groupedTemplates.sharedTemplates.length}</Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {groupedTemplates.sharedTemplates.map((template) => (
                            <Card key={template.id} className="relative border-green-200 dark:border-green-800" data-testid={`card-template-${template.id}`}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                      {purposeOptions.find(p => p.value === template.purpose)?.label || template.purpose}
                                    </Badge>
                                  </div>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    <Share2 className="w-3 h-3 mr-1" /> Shared
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">{template.subject}</p>
                              </CardContent>
                              <div className="p-4 pt-0 flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setPreviewContent({ subject: template.subject, body: template.body }); setPreviewDialogOpen(true); }} data-testid={`button-preview-template-${template.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => duplicateTemplateMutation.mutate(template.id)}
                                  title="Copy to my templates"
                                  data-testid={`button-duplicate-template-${template.id}`}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* WORKSPACE TEMPLATES */}
                    {(groupedTemplates?.workspaceTemplates?.length ?? 0) > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 className="w-5 h-5 text-purple-500" />
                          <h3 className="font-semibold text-lg">Workspace Templates</h3>
                          <Badge variant="secondary" className="ml-2">{groupedTemplates.workspaceTemplates.length}</Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {groupedTemplates.workspaceTemplates.map((template) => (
                            <Card key={template.id} className="relative border-purple-200 dark:border-purple-800" data-testid={`card-template-${template.id}`}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">{template.name}</CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                      {purposeOptions.find(p => p.value === template.purpose)?.label || template.purpose}
                                    </Badge>
                                  </div>
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                    <Building2 className="w-3 h-3 mr-1" /> Workspace
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">{template.subject}</p>
                              </CardContent>
                              <div className="p-4 pt-0 flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)} data-testid={`button-edit-template-${template.id}`}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setPreviewContent({ subject: template.subject, body: template.body }); setPreviewDialogOpen(true); }} data-testid={`button-preview-template-${template.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => duplicateTemplateMutation.mutate(template.id)}
                                  title="Copy to my templates"
                                  data-testid={`button-duplicate-template-${template.id}`}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SYSTEM TEMPLATES */}
                    {(groupedTemplates?.systemTemplates?.length ?? 0) > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Globe className="w-5 h-5 text-gray-500" />
                          <h3 className="font-semibold text-lg">System Templates</h3>
                          <Badge variant="secondary" className="ml-2">{groupedTemplates.systemTemplates.length}</Badge>
                          <Lock className="w-4 h-4 text-muted-foreground ml-1" title="Read-only" />
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {groupedTemplates.systemTemplates.map((template) => (
                            <Card key={template.id} className="relative border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50" data-testid={`card-template-${template.id}`}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base flex items-center gap-2">
                                      {template.name}
                                      <Lock className="w-3 h-3 text-muted-foreground" />
                                    </CardTitle>
                                    <Badge variant="outline" className="mt-1">
                                      {purposeOptions.find(p => p.value === template.purpose)?.label || template.purpose}
                                    </Badge>
                                  </div>
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                    <Globe className="w-3 h-3 mr-1" /> System
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <p className="text-sm text-muted-foreground line-clamp-2">{template.subject}</p>
                              </CardContent>
                              <div className="p-4 pt-0 flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setPreviewContent({ subject: template.subject, body: template.body }); setPreviewDialogOpen(true); }} data-testid={`button-preview-template-${template.id}`}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => duplicateTemplateMutation.mutate(template.id)}
                                  title="Copy to my templates for editing"
                                  data-testid={`button-duplicate-template-${template.id}`}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AUTOMATIONS TAB */}
          <TabsContent value="automations">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Automation Rules</CardTitle>
                  <CardDescription>Configure automatic email triggers based on CRM events</CardDescription>
                </div>
                <Dialog open={automationDialogOpen} onOpenChange={(open) => { setAutomationDialogOpen(open); if (!open) resetAutomationForm(); }}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-automation">
                      <Plus className="w-4 h-4 mr-2" /> Create Automation
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Automation Rule</DialogTitle>
                      <DialogDescription>
                        Set up automatic email sending based on triggers
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Rule Name *</Label>
                        <Input
                          value={automationForm.name}
                          onChange={(e) => setAutomationForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Invoice Payment Reminder"
                          data-testid="input-automation-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={automationForm.description}
                          onChange={(e) => setAutomationForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="What does this automation do?"
                          rows={2}
                          data-testid="input-automation-description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Trigger *</Label>
                        <Select value={automationForm.trigger} onValueChange={(v) => setAutomationForm(prev => ({ ...prev, trigger: v }))}>
                          <SelectTrigger data-testid="select-automation-trigger">
                            <SelectValue placeholder="Select trigger..." />
                          </SelectTrigger>
                          <SelectContent>
                            {triggerOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Email Template *</Label>
                        <Select value={automationForm.templateId} onValueChange={(v) => setAutomationForm(prev => ({ ...prev, templateId: v }))}>
                          <SelectTrigger data-testid="select-automation-template">
                            <SelectValue placeholder="Select template..." />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(t => (
                              <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Delay</Label>
                          <Input
                            type="number"
                            value={automationForm.delayValue}
                            onChange={(e) => setAutomationForm(prev => ({ ...prev, delayValue: parseInt(e.target.value) || 0 }))}
                            min={0}
                            data-testid="input-automation-delay"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Unit</Label>
                          <Select value={automationForm.delayUnit} onValueChange={(v) => setAutomationForm(prev => ({ ...prev, delayUnit: v }))}>
                            <SelectTrigger data-testid="select-automation-delay-unit">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setAutomationDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => createAutomationMutation.mutate(automationForm)} disabled={!automationForm.name || !automationForm.trigger || !automationForm.templateId} data-testid="button-save-automation">
                        Create Automation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {automations.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No automation rules yet. Create your first automation to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {automations.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`card-automation-${rule.id}`}>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={rule.isEnabled}
                            onCheckedChange={(checked) => toggleAutomationMutation.mutate({ id: rule.id, isEnabled: checked })}
                            data-testid={`switch-automation-${rule.id}`}
                          />
                          <div>
                            <h3 className="font-medium">{rule.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {triggerOptions.find(t => t.value === rule.trigger)?.label}
                              {rule.delayValue > 0 && ` (after ${rule.delayValue} ${rule.delayUnit})`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{rule.triggerCount} triggered</Badge>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteAutomationMutation.mutate(rule.id)} data-testid={`button-delete-automation-${rule.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* FOLLOW-UPS TAB */}
          <TabsContent value="followups">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Follow-up Sequences</CardTitle>
                  <CardDescription>Create multi-step email sequences for automated follow-ups</CardDescription>
                </div>
                <Dialog open={sequenceDialogOpen} onOpenChange={(open) => { setSequenceDialogOpen(open); if (!open) resetSequenceForm(); }}>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-sequence">
                      <Plus className="w-4 h-4 mr-2" /> Create Sequence
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Follow-up Sequence</DialogTitle>
                      <DialogDescription>
                        Set up a multi-step email sequence
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Sequence Name *</Label>
                        <Input
                          value={sequenceForm.name}
                          onChange={(e) => setSequenceForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Payment Collection"
                          data-testid="input-sequence-name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={sequenceForm.description}
                          onChange={(e) => setSequenceForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="What is this sequence for?"
                          rows={2}
                          data-testid="input-sequence-description"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Purpose</Label>
                        <Select value={sequenceForm.purpose} onValueChange={(v) => setSequenceForm(prev => ({ ...prev, purpose: v }))}>
                          <SelectTrigger data-testid="select-sequence-purpose">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="payment">Payment Collection</SelectItem>
                            <SelectItem value="quotation">Quotation Follow-up</SelectItem>
                            <SelectItem value="onboarding">Onboarding</SelectItem>
                            <SelectItem value="renewal">Renewal</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="general">General</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSequenceDialogOpen(false)}>Cancel</Button>
                      <Button onClick={() => createSequenceMutation.mutate(sequenceForm)} disabled={!sequenceForm.name} data-testid="button-save-sequence">
                        Create Sequence
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {sequences.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No follow-up sequences yet. Create your first sequence to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sequences.map((sequence) => (
                      <div key={sequence.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`card-sequence-${sequence.id}`}>
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={sequence.isEnabled}
                            onCheckedChange={(checked) => toggleSequenceMutation.mutate({ id: sequence.id, isEnabled: checked })}
                            data-testid={`switch-sequence-${sequence.id}`}
                          />
                          <div>
                            <h3 className="font-medium">{sequence.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {sequence.description || `${sequence.purpose} sequence`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{sequence.steps?.length || 0} steps</Badge>
                          <Button variant="outline" size="sm" onClick={() => openStepDesigner(sequence)} data-testid={`button-design-sequence-${sequence.id}`}>
                            <Edit className="w-4 h-4 mr-1" /> Design
                          </Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSequenceMutation.mutate(sequence.id)} data-testid={`button-delete-sequence-${sequence.id}`}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step Designer Dialog */}
            <Dialog open={designerDialogOpen} onOpenChange={(open) => { setDesignerDialogOpen(open); if (!open) setSelectedSequence(null); }}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Design Sequence: {selectedSequence?.name}</DialogTitle>
                  <DialogDescription>
                    Add and arrange steps in your follow-up sequence. Each step sends an email after a specified delay.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  {/* Current Steps */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Current Steps</Label>
                    {(!selectedSequence?.steps || selectedSequence.steps.length === 0) ? (
                      <p className="text-sm text-muted-foreground">No steps yet. Add your first step below.</p>
                    ) : (
                      <div className="space-y-2">
                        {[...selectedSequence.steps].sort((a, b) => a.stepOrder - b.stepOrder).map((step, index, arr) => (
                          <div key={step.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30" data-testid={`step-${step.id}`}>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col gap-1">
                                <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === 0 || stepOperationPending} onClick={() => moveStep(step, "up")} data-testid={`button-moveup-step-${step.id}`}>
                                  <ChevronUp className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5" disabled={index === arr.length - 1 || stepOperationPending} onClick={() => moveStep(step, "down")} data-testid={`button-movedown-step-${step.id}`}>
                                  <ChevronDown className="w-3 h-3" />
                                </Button>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{getTemplateName(step.templateId)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {step.delayDays === 0 ? "Immediately" : `After ${step.delayDays} day${step.delayDays > 1 ? "s" : ""}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" disabled={stepOperationPending} onClick={() => startEditingStep(step)} data-testid={`button-edit-step-${step.id}`}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive" disabled={stepOperationPending} onClick={() => deleteStepMutation.mutate(step.id)} data-testid={`button-delete-step-${step.id}`}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Add/Edit Step */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">
                      {editingStep ? "Edit Step" : "Add New Step"}
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Email Template *</Label>
                        <Select value={stepForm.templateId} onValueChange={(v) => setStepForm(prev => ({ ...prev, templateId: v }))}>
                          <SelectTrigger data-testid="select-step-template">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>{template.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Delay (Days)</Label>
                        <Input 
                          type="number" 
                          min="0" 
                          value={stepForm.delayDays} 
                          onChange={(e) => setStepForm(prev => ({ ...prev, delayDays: parseInt(e.target.value) || 0 }))}
                          placeholder="0 = immediately"
                          data-testid="input-step-delay"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editingStep ? (
                        <>
                          <Button 
                            onClick={() => updateStepMutation.mutate({ id: editingStep.id, data: { templateId: stepForm.templateId, delayDays: stepForm.delayDays } })}
                            disabled={!stepForm.templateId || stepOperationPending}
                            data-testid="button-save-step"
                          >
                            {stepOperationPending ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button variant="outline" onClick={cancelEditingStep} disabled={stepOperationPending} data-testid="button-cancel-edit">
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={() => selectedSequence && createStepMutation.mutate({ sequenceId: selectedSequence.id, data: stepForm })}
                          disabled={!stepForm.templateId || stepOperationPending}
                          data-testid="button-add-step"
                        >
                          <Plus className="w-4 h-4 mr-2" /> {stepOperationPending ? "Adding..." : "Add Step"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setDesignerDialogOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* LOGS TAB */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Email Logs</CardTitle>
                <CardDescription>Track all sent emails and their delivery status</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No emails sent yet. Send your first email to see logs here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`card-log-${log.id}`}>
                        <div className="flex items-center gap-4">
                          <Badge className={statusColors[log.status] || "bg-gray-100"}>
                            <span className="flex items-center gap-1">
                              {statusIcons[log.status]}
                              {log.status}
                            </span>
                          </Badge>
                          <div>
                            <h3 className="font-medium">{log.subject}</h3>
                            <p className="text-sm text-muted-foreground">
                              To: {log.toEmail}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {log.sentAt ? format(new Date(log.sentAt), "MMM d, yyyy HH:mm") : format(new Date(log.createdAt), "MMM d, yyyy HH:mm")}
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => { setPreviewContent({ subject: log.subject, body: log.body }); setPreviewDialogOpen(true); }} data-testid={`button-view-log-${log.id}`}>
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-muted-foreground">Subject</Label>
                <p className="font-medium">{previewContent.subject}</p>
              </div>
              <Separator />
              <div>
                <Label className="text-muted-foreground">Body</Label>
                <div className="mt-2 p-4 bg-muted rounded-lg whitespace-pre-wrap">
                  {previewContent.body}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
