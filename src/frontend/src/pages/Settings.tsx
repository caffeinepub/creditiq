import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bell,
  Database,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Profile</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                defaultValue="Priya Sharma"
                className="bg-muted/40 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Role
              </Label>
              <Input
                defaultValue="Credit Manager"
                className="bg-muted/40 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Email
              </Label>
              <Input
                defaultValue="priya.sharma@creditiq.in"
                className="bg-muted/40 border-border"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Department
              </Label>
              <Input
                defaultValue="Corporate Credit"
                className="bg-muted/40 border-border"
              />
            </div>
          </div>
          <div className="pt-2">
            <Button
              size="sm"
              className="bg-primary/90 hover:bg-primary text-xs"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Notifications
          </h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            {
              label: "Early Warning Signals",
              desc: "Get notified when critical EWS are detected",
              defaultOn: true,
            },
            {
              label: "Case Status Updates",
              desc: "Notifications when case status changes",
              defaultOn: true,
            },
            {
              label: "Analysis Complete",
              desc: "Alert when AI analysis finishes",
              defaultOn: true,
            },
            {
              label: "Weekly Summary",
              desc: "Receive weekly portfolio digest",
              defaultOn: false,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <Switch defaultChecked={item.defaultOn} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Security</h2>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-muted-foreground">
                Add extra security to your account
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Data & Integrations */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Database className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Data & Integrations
          </h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            {
              name: "Databricks ML Platform",
              status: "Connected",
              color: "text-emerald-400",
            },
            {
              name: "MCA Portal API",
              status: "Connected",
              color: "text-emerald-400",
            },
            {
              name: "eCourts API",
              status: "Connected",
              color: "text-emerald-400",
            },
            {
              name: "CERSAI Integration",
              status: "Not Connected",
              color: "text-muted-foreground",
            },
          ].map((int) => (
            <div
              key={int.name}
              className="flex items-center justify-between py-1"
            >
              <span className="text-sm text-foreground">{int.name}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${int.color}`}>{int.status}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  Configure
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
