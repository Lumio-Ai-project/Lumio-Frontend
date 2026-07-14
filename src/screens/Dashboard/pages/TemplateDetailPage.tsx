import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Loading } from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DeleteTemplatePopover } from '@/screens/Dashboard/components/DeleteTemplatePopover';
import { useTemplate, useUpdateTemplate } from '@/hooks/use-templates';
import { ROUTES } from '@/routes/paths';
import type { TemplateChannel } from '@/types/template';

const TEMPLATE_CHANNELS: TemplateChannel[] = ['EMAIL', 'SMS', 'PUSH', 'HTML', 'TEXT'];

export function TemplateDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: template, isLoading } = useTemplate(id);
  const updateTemplate = useUpdateTemplate();

  const [name, setName] = useState('');
  const [channel, setChannel] = useState<TemplateChannel>('EMAIL');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!template) {
      return;
    }
    setName(template.name);
    setChannel(template.channel);
    setSubject(template.subject ?? '');
    setBodyHtml(template.bodyHtml ?? '');
    setBodyText(template.bodyText ?? '');
    setIsActive(template.isActive);
  }, [template]);

  const handleSave = async () => {
    if (!template) {
      return;
    }
    await updateTemplate.mutateAsync({
      id: template.id,
      name,
      channel,
      subject: subject || null,
      bodyHtml: bodyHtml || null,
      bodyText: bodyText || null,
      isActive,
      variables: template.variables,
    });
  };

  if (isLoading) {
    return <Loading layout="inline" />;
  }

  if (!template) {
    return <p className="text-muted-foreground">Template not found.</p>;
  }

  return (
    <div className="flex flex-col gap-stack">
      <div className="flex flex-wrap items-center justify-between gap-stack-sm">
        <div>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <p className="mt-stack-sm text-sm text-muted-foreground">
            Slug: <code>{template.slug}</code>
          </p>
        </div>
        <div className="flex gap-stack-sm">
          <Button type="button" variant="outline" onClick={() => navigate(ROUTES.DASHBOARD_TEMPLATES)}>
            Back
          </Button>
          <DeleteTemplatePopover
            template={template}
            triggerVariant="button"
            onDeleted={() => navigate(ROUTES.DASHBOARD_TEMPLATES)}
          />
          <Button type="button" disabled={updateTemplate.isPending} onClick={() => void handleSave()}>
            {updateTemplate.isPending ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit template</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-stack">
          <div className="flex flex-col gap-stack-sm">
            <Label htmlFor="template-name">Name</Label>
            <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="flex flex-col gap-stack-sm">
            <Label htmlFor="template-channel">Channel</Label>
            <select
              id="template-channel"
              value={channel}
              onChange={(e) => setChannel(e.target.value as TemplateChannel)}
              className="flex h-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {TEMPLATE_CHANNELS.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <Label htmlFor="template-subject">Subject</Label>
            <Input
              id="template-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-stack-sm">
            <Label htmlFor="template-body-html">Body HTML</Label>
            <textarea
              id="template-body-html"
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-col gap-stack-sm">
            <Label htmlFor="template-body-text">Body text</Label>
            <textarea
              id="template-body-text"
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <label className="flex items-center gap-stack-sm text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </CardContent>
      </Card>
    </div>
  );
}
