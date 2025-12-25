import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { saasAdminApi, authApi } from "@/lib/api";
import { useLocation } from "wouter";
import { 
  Settings, Save, Shield, Mail, Sparkles, 
  Eye, EyeOff, Key, Check, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function PlatformSettings() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("ai");
  
  const [aiSettingsForm, setAiSettingsForm] = useState({ 
    openaiApiKey: "", 
    provider: "openai",
    isEnabled: true 
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [emailSettingsForm, setEmailSettingsForm] = useState({ 
    smtpHost: "", 
    smtpPort: "", 
    smtpUser: "", 
    smtpPassword: "", 
    senderEmail: "", 
    senderName: "" 
  });

  const { data: currentUser, isLoading: loadingUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.me,
  });

  const { data: settings = [], isLoading: loadingSettings } = useQuery({
    queryKey: ["platformSettings"],
    queryFn: saasAdminApi.getSettings,
    enabled: currentUser?.userType === "saas_admin",
  });

  useEffect(() => {
    if (settings && settings.length > 0) {
      const openaiEnabledSetting = settings.find((s: any) => s.key === 'openai_enabled');
      setAiSettingsForm(prev => ({
        ...prev,
        isEnabled: openaiEnabledSetting ? openaiEnabledSetting.value === 'true' : true
      }));

      const smtpSettings = {
        smtpHost: settings.find((s: any) => s.key === 'smtp_host')?.value || "",
        smtpPort: settings.find((s: any) => s.key === 'smtp_port')?.value || "",
        smtpUser: settings.find((s: any) => s.key === 'smtp_user')?.value || "",
        smtpPassword: "",
        senderEmail: settings.find((s: any) => s.key === 'sender_email')?.value || "",
        senderName: settings.find((s: any) => s.key === 'sender_name')?.value || "",
      };
      setEmailSettingsForm(smtpSettings);
    }
  }, [settings]);

  const updateSettingMutation = useMutation({
    mutationFn: saasAdminApi.updateSetting,
    onSuccess: () => {
      toast.success("Setting saved successfully");
      queryClient.invalidateQueries({ queryKey: ["platformSettings"] });
    },
    onError: () => {
      toast.error("Failed to save setting");
    },
  });

  const handleSaveOpenAiKey = () => {
    if (aiSettingsForm.openaiApiKey) {
      updateSettingMutation.mutate({
        key: 'openai_api_key',
        value: aiSettingsForm.openaiApiKey,
        category: 'ai',
        description: 'Platform OpenAI API Key',
        isSensitive: true,
      });
      setAiSettingsForm(prev => ({ ...prev, openaiApiKey: '' }));
    }
  };

  const handleToggleOpenAi = (enabled: boolean) => {
    setAiSettingsForm(prev => ({ ...prev, isEnabled: enabled }));
    updateSettingMutation.mutate({
      key: 'openai_enabled',
      value: enabled.toString(),
      category: 'ai',
      description: 'Enable/disable global OpenAI access',
      isSensitive: false,
    });
  };

  const handleSaveEmailSettings = () => {
    const emailSettings = [
      { key: 'smtp_host', value: emailSettingsForm.smtpHost, category: 'email', description: 'SMTP Server Host', isSensitive: false },
      { key: 'smtp_port', value: emailSettingsForm.smtpPort, category: 'email', description: 'SMTP Server Port', isSensitive: false },
      { key: 'smtp_user', value: emailSettingsForm.smtpUser, category: 'email', description: 'SMTP Username', isSensitive: false },
      { key: 'smtp_password', value: emailSettingsForm.smtpPassword, category: 'email', description: 'SMTP Password', isSensitive: true },
      { key: 'sender_email', value: emailSettingsForm.senderEmail, category: 'email', description: 'Default Sender Email', isSensitive: false },
      { key: 'sender_name', value: emailSettingsForm.senderName, category: 'email', description: 'Default Sender Name', isSensitive: false },
    ];
    emailSettings.filter(s => s.value).forEach(s => updateSettingMutation.mutate(s));
  };

  const getOpenAiKeyDisplay = () => {
    const keySetting = settings.find((s: any) => s.key === 'openai_api_key');
    if (!keySetting?.value) return null;
    return keySetting.value;
  };

  const hasOpenAiKey = () => {
    const keySetting = settings.find((s: any) => s.key === 'openai_api_key');
    return keySetting?.hasValue || !!keySetting?.value;
  };

  if (loadingUser || loadingSettings) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (currentUser?.userType !== "saas_admin") {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Access denied. Super admin privileges required.</p>
              </CardContent>
            </Card>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
              <p className="text-muted-foreground text-sm">Configure platform-wide settings for AI, Email, and more</p>
            </div>
          </div>

          <div className="max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="ai" className="flex items-center gap-2" data-testid="tab-settings-ai">
                <Sparkles className="h-4 w-4" />
                AI
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2" data-testid="tab-settings-email">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2" data-testid="tab-settings-security">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1685a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
                        </svg>
                      </div>
                      <div>
                        <CardTitle>OpenAI Configuration</CardTitle>
                        <CardDescription>Configure the platform-wide OpenAI API key for AI features</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {hasOpenAiKey() && (
                        <Badge variant={aiSettingsForm.isEnabled ? "default" : "secondary"} className="gap-1">
                          {aiSettingsForm.isEnabled ? (
                            <><Check className="h-3 w-3" /> Enabled</>
                          ) : (
                            <><AlertCircle className="h-3 w-3" /> Disabled</>
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Enable Global AI Access</p>
                        <p className="text-sm text-muted-foreground">
                          When enabled, the platform OpenAI key will be available for AI features
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettingsForm.isEnabled}
                      onCheckedChange={handleToggleOpenAi}
                      disabled={updateSettingMutation.isPending}
                      data-testid="switch-openai-enabled"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            id="openaiApiKey"
                            type={showApiKey ? "text" : "password"}
                            value={aiSettingsForm.openaiApiKey}
                            onChange={(e) => setAiSettingsForm({...aiSettingsForm, openaiApiKey: e.target.value})}
                            placeholder={hasOpenAiKey() ? '••••••••••••••••' : 'sk-...'}
                            className="pr-10"
                            data-testid="input-openai-api-key"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowApiKey(!showApiKey)}
                            data-testid="button-toggle-key-visibility"
                          >
                            {showApiKey ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <Button 
                          onClick={handleSaveOpenAiKey}
                          disabled={!aiSettingsForm.openaiApiKey || updateSettingMutation.isPending}
                          data-testid="button-save-openai-key"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Key
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {hasOpenAiKey() ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            <span>API key is configured</span>
                            {getOpenAiKeyDisplay() && (
                              <span className="text-green-600 font-mono text-xs ml-2">
                                {getOpenAiKeyDisplay()}
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span>No API key configured yet</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>Note:</strong> Users can configure their own OpenAI API key in their settings. 
                      User keys take priority over the platform key.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>Email SMTP Configuration</CardTitle>
                      <CardDescription>Configure email sending for notifications and transactional emails</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">SMTP Host</Label>
                      <Input
                        id="smtpHost"
                        value={emailSettingsForm.smtpHost}
                        onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpHost: e.target.value})}
                        placeholder="smtp.example.com"
                        data-testid="input-smtp-host"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        value={emailSettingsForm.smtpPort}
                        onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpPort: e.target.value})}
                        placeholder="587"
                        data-testid="input-smtp-port"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpUser">SMTP Username</Label>
                      <Input
                        id="smtpUser"
                        value={emailSettingsForm.smtpUser}
                        onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpUser: e.target.value})}
                        placeholder="user@example.com"
                        data-testid="input-smtp-user"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={emailSettingsForm.smtpPassword}
                        onChange={(e) => setEmailSettingsForm({...emailSettingsForm, smtpPassword: e.target.value})}
                        placeholder="••••••••"
                        data-testid="input-smtp-password"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="senderEmail">Sender Email</Label>
                      <Input
                        id="senderEmail"
                        value={emailSettingsForm.senderEmail}
                        onChange={(e) => setEmailSettingsForm({...emailSettingsForm, senderEmail: e.target.value})}
                        placeholder="noreply@example.com"
                        data-testid="input-sender-email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="senderName">Sender Name</Label>
                      <Input
                        id="senderName"
                        value={emailSettingsForm.senderName}
                        onChange={(e) => setEmailSettingsForm({...emailSettingsForm, senderName: e.target.value})}
                        placeholder="My Platform"
                        data-testid="input-sender-name"
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleSaveEmailSettings}
                    disabled={updateSettingMutation.isPending}
                    data-testid="button-save-email-settings"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Email Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Configure platform security and access controls</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Security settings coming soon</p>
                    <p className="text-sm mt-2">Configure password policies, session timeouts, and more</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
