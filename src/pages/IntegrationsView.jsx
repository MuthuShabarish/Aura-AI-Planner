import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Calendar,
  Mail,
  RefreshCw,
  CheckCircle2,
  Share2,
  FileText,
  MessageSquare,
  Activity,
  Zap,
  Globe
} from 'lucide-react';

export const IntegrationsView = () => {
  const {
    googleCalendarState,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    syncGoogleCalendar,
    gmailState,
    connectGmail,
    disconnectGmail,
    syncGmail
  } = useApp();

  const [customGCalEmail, setCustomGCalEmail] = useState('alex.morgan@aura.app');
  const [customGmailEmail, setCustomGmailEmail] = useState('alex.morgan@aura.app');
  const [isNotionConnected, setIsNotionConnected] = useState(false);
  const [isSlackConnected, setIsSlackConnected] = useState(false);

  const isGCalConnected = googleCalendarState?.status === 'CONNECTED';
  const isGmailConnected = gmailState?.status === 'CONNECTED';

  const connectedCount = (isGCalConnected ? 1 : 0) + (isGmailConnected ? 1 : 0) + (isNotionConnected ? 1 : 0) + (isSlackConnected ? 1 : 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-heading">Integrations & Sync</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Connect external productivity tools and calendar services</p>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase font-heading">Active Integrations</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">{connectedCount} Connected</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-emerald-500 uppercase font-heading">Auto-Sync Status</p>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-heading">Live Sync</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </Card>

        <Card className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-sky-500 uppercase font-heading">Available Connectors</p>
            <h3 className="text-2xl font-extrabold text-sky-600 dark:text-sky-400 mt-1 font-heading">4 Services</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Calendar Card */}
        <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-100 dark:border-sky-900/50">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Google Calendar</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Two-way event sync with Google Calendar</p>
              </div>
            </div>
            <Badge variant={isGCalConnected ? 'green' : 'gray'}>
              {isGCalConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isGCalConnected
              ? `Connected as ${googleCalendarState.connectedEmail}. Last synced ${googleCalendarState.lastSyncedAt ? new Date(googleCalendarState.lastSyncedAt).toLocaleTimeString() : 'Recently'}.`
              : 'Connect your Google account to automatically import meetings and schedule blocks.'}
          </p>

          {!isGCalConnected && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Account Email</label>
              <input
                type="email"
                value={customGCalEmail}
                onChange={(e) => setCustomGCalEmail(e.target.value)}
                className="aura-input text-xs py-1.5 text-slate-900 dark:text-white"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {isGCalConnected ? (
              <>
                <Button variant="ghost" size="sm" icon={RefreshCw} onClick={syncGoogleCalendar}>
                  Sync Now
                </Button>
                <Button variant="danger" size="sm" onClick={disconnectGoogleCalendar}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => connectGoogleCalendar(customGCalEmail)}>
                Connect Google Calendar
              </Button>
            )}
          </div>
        </Card>

        {/* Gmail Sync Card */}
        <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100 dark:border-rose-900/50">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Gmail Integration</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Convert important emails into planner tasks</p>
              </div>
            </div>
            <Badge variant={isGmailConnected ? 'green' : 'gray'}>
              {isGmailConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isGmailConnected
              ? `Connected as ${gmailState.connectedEmail}. Syncing flagged emails as actionable tasks.`
              : 'Link your Gmail inbox to create tasks directly from emails.'}
          </p>

          {!isGmailConnected && (
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Account Email</label>
              <input
                type="email"
                value={customGmailEmail}
                onChange={(e) => setCustomGmailEmail(e.target.value)}
                className="aura-input text-xs py-1.5 text-slate-900 dark:text-white"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {isGmailConnected ? (
              <>
                <Button variant="ghost" size="sm" icon={RefreshCw} onClick={syncGmail}>
                  Sync Inbox
                </Button>
                <Button variant="danger" size="sm" onClick={disconnectGmail}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button variant="primary" size="sm" onClick={() => connectGmail(customGmailEmail)}>
                Connect Gmail Inbox
              </Button>
            )}
          </div>
        </Card>

        {/* Notion Workspace Sync */}
        <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Notion Workspace</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sync database pages & study docs</p>
              </div>
            </div>
            <Badge variant={isNotionConnected ? 'green' : 'gray'}>
              {isNotionConnected ? 'Connected' : 'Available'}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isNotionConnected
              ? 'Notion workspace connected. Syncing notes and database items.'
              : 'Connect your Notion workspace to import pages directly into Notes.'}
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant={isNotionConnected ? 'ghost' : 'primary'}
              size="sm"
              onClick={() => setIsNotionConnected(!isNotionConnected)}
            >
              {isNotionConnected ? 'Disconnect' : 'Connect Notion'}
            </Button>
          </div>
        </Card>

        {/* Slack Notifications */}
        <Card className="p-6 space-y-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/50">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">Slack Status Sync</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Auto DND when Focus Timer is active</p>
              </div>
            </div>
            <Badge variant={isSlackConnected ? 'green' : 'gray'}>
              {isSlackConnected ? 'Connected' : 'Available'}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {isSlackConnected
              ? 'Slack connected. Automatically updates your status to "In Focus Session".'
              : 'Connect Slack to automatically toggle Do Not Disturb during focus sessions.'}
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant={isSlackConnected ? 'ghost' : 'primary'}
              size="sm"
              onClick={() => setIsSlackConnected(!isSlackConnected)}
            >
              {isSlackConnected ? 'Disconnect' : 'Connect Slack'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};