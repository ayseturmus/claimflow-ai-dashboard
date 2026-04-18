import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ClipboardList, FileText, ImageIcon, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCallback, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { fetchClaimProcess } from '@/features/claim/api'
import type { IncidentStatusKey } from '@/features/claim/schemas'
import { IncidentProcessOverview } from '@/features/incidents/IncidentProcessOverview'
import { formatIncidentDate, incidentStatusBadgeVariant } from '@/features/incidents/incidentUi'
import { cn } from '@/lib/utils'

type FileItem = { id: string; name: string }

function newLocalId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function DropUploadZone({
  inputId,
  label,
  hint,
  dropLabel,
  chooseLabel,
  removeAria,
  accept,
  files,
  onAdd,
  onRemove,
  icon,
}: {
  inputId: string
  label: string
  hint: string
  dropLabel: string
  chooseLabel: string
  removeAria: string
  accept: string
  files: FileItem[]
  onAdd: (list: FileList | null) => void
  onRemove: (id: string) => void
  icon: ReactNode
}) {
  const [drag, setDrag] = useState(false)

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDrag(false)
      onAdd(e.dataTransfer.files)
    },
    [onAdd],
  )

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {icon}
          </div>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base">{label}</CardTitle>
            <CardDescription className="text-sm">{hint}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragEnter={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragOver={(e) => {
            e.preventDefault()
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={cn(
            'relative rounded-xl border-2 border-dashed border-border bg-muted/20 px-4 py-8 text-center transition-colors',
            drag && 'border-primary bg-primary/5',
          )}
        >
          <input
            id={inputId}
            type="file"
            className="sr-only"
            accept={accept}
            multiple
            onChange={(e) => {
              onAdd(e.target.files)
              e.target.value = ''
            }}
          />
          <p className="text-sm font-medium text-foreground">{dropLabel}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            <label htmlFor={inputId} className="cursor-pointer underline-offset-4 hover:underline">
              {chooseLabel}
            </label>
          </p>
        </div>

        {files.length ? (
          <ul className="space-y-2 rounded-lg border bg-background p-3">
            {files.map((f) => (
              <li
                key={f.id}
                className="flex items-center justify-between gap-2 text-sm"
              >
                <span className="min-w-0 truncate">{f.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  aria-label={`${removeAria}: ${f.name}`}
                  onClick={() => onRemove(f.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function IncidentDetailPage() {
  const { incidentId } = useParams<{ incidentId: string }>()
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('tr') ? 'tr-TR' : 'en-US'

  const photoInputId = useId()
  const reportInputId = useId()

  const q = useQuery({
    queryKey: ['claim-process'],
    queryFn: fetchClaimProcess,
    staleTime: 60_000,
  })

  const incident =
    q.data?.incidents && incidentId
      ? q.data.incidents.find((x) => x.id === incidentId)
      : undefined

  const [photos, setPhotos] = useState<FileItem[]>([])
  const [reports, setReports] = useState<FileItem[]>([])
  const [partnerNote, setPartnerNote] = useState('')
  const [partnerNoteSent, setPartnerNoteSent] = useState(false)

  const [supportTopic, setSupportTopic] = useState('')
  const [supportBody, setSupportBody] = useState('')
  const [supportSent, setSupportSent] = useState(false)
  const [supportErr, setSupportErr] = useState(false)

  const copy = useCallback(
    (field: 'title' | 'location' | 'detailBody') => {
      if (!incidentId) return ''
      return t(`incidents.byId.${incidentId}.${field}`)
    },
    [incidentId, t],
  )

  function addPhotos(list: FileList | null) {
    if (!list?.length) return
    const next: FileItem[] = []
    for (let i = 0; i < list.length; i++) {
      const f = list.item(i)
      if (f) next.push({ id: newLocalId(), name: f.name })
    }
    setPhotos((p) => [...p, ...next])
  }

  function addReports(list: FileList | null) {
    if (!list?.length) return
    const next: FileItem[] = []
    for (let i = 0; i < list.length; i++) {
      const f = list.item(i)
      if (f) next.push({ id: newLocalId(), name: f.name })
    }
    setReports((p) => [...p, ...next])
  }

  function submitPartnerNote() {
    if (!partnerNote.trim()) return
    setPartnerNoteSent(true)
  }

  function submitSupport(e: React.FormEvent) {
    e.preventDefault()
    if (!supportBody.trim()) {
      setSupportErr(true)
      return
    }
    setSupportErr(false)
    setSupportSent(true)
  }

  if (q.isPending) {
    return (
      <div className="min-h-dvh text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (q.isError) {
    return (
      <div className="min-h-dvh text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <p className="text-sm text-destructive">{t('errorLoad')}</p>
          <Button asChild className="mt-6 touch-manipulation" variant="outline">
            <Link to="/">{t('incidents.backToList')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!incident || !incidentId) {
    return (
      <div className="min-h-dvh text-foreground">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-lg font-semibold">{t('incidents.notFound')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t('incidents.notFoundBody')}</p>
          <Button asChild className="mt-6 touch-manipulation" variant="outline">
            <Link to="/">{t('incidents.backToList')}</Link>
          </Button>
        </div>
      </div>
    )
  }

  const statusKey = incident.statusKey as IncidentStatusKey

  return (
    <div className="min-h-dvh text-foreground antialiased">
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button asChild variant="ghost" size="icon" className="shrink-0 touch-manipulation">
              <Link to="/" aria-label={t('incidents.backToList')}>
                <ChevronLeft />
              </Link>
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{t('layout.brandName')}</p>
              <p className="truncate text-xs text-muted-foreground">{t('incidents.topBarTitle')}</p>
            </div>
          </div>
          <LanguageSwitcher variant="compact" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 pb-20">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={incidentStatusBadgeVariant(statusKey)}>
              {t(`incidents.status.${statusKey}`)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{t('incidents.dateLabel')}: </span>
              {formatIncidentDate(incident.occurredAt, locale)}
            </span>
          </div>
          <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
            {copy('title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{t('incidents.locationLabel')}: </span>
            {copy('location')}
          </p>
        </div>

        <Separator className="my-8" />

        <IncidentProcessOverview incident={incident} locale={locale} />

        <Separator className="my-10" />

        <Card className="mb-8 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">{t('incidents.detailSectionTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{copy('detailBody')}</p>
          </CardContent>
        </Card>

        <div className="mb-4 space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{t('incidents.documentsSectionTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('incidents.documentsSectionSubtitle')}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DropUploadZone
            inputId={photoInputId}
            label={t('incidents.photoTitle')}
            hint={t('incidents.photoHint')}
            dropLabel={t('incidents.photoDrop')}
            chooseLabel={t('incidents.chooseFiles')}
            removeAria={t('incidents.removeFile')}
            accept="image/jpeg,image/png,image/webp,image/heic,.heic"
            files={photos}
            onAdd={addPhotos}
            onRemove={(id) => setPhotos((p) => p.filter((x) => x.id !== id))}
            icon={<ImageIcon className="h-5 w-5" aria-hidden />}
          />
          <DropUploadZone
            inputId={reportInputId}
            label={t('incidents.reportTitle')}
            hint={t('incidents.reportHint')}
            dropLabel={t('incidents.reportDrop')}
            chooseLabel={t('incidents.chooseFiles')}
            removeAria={t('incidents.removeFile')}
            accept=".pdf,image/jpeg,image/png,image/webp,application/pdf"
            files={reports}
            onAdd={addReports}
            onRemove={(id) => setReports((p) => p.filter((x) => x.id !== id))}
            icon={<FileText className="h-5 w-5" aria-hidden />}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-6">
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ClipboardList className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base">{t('incidents.partnerNoteTitle')}</CardTitle>
                  <CardDescription>{t('incidents.partnerNoteHint')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {partnerNoteSent ? (
                <div className="space-y-3">
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                    {t('incidents.partnerNoteSuccess')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="touch-manipulation"
                    onClick={() => {
                      setPartnerNoteSent(false)
                      setPartnerNote('')
                    }}
                  >
                    {t('incidents.partnerNoteAnother')}
                  </Button>
                </div>
              ) : (
                <>
                  <Textarea
                    value={partnerNote}
                    onChange={(e) => setPartnerNote(e.target.value)}
                    placeholder={t('incidents.partnerNotePlaceholder')}
                    rows={4}
                    className="resize-none text-sm"
                  />
                  <Button
                    type="button"
                    className="touch-manipulation"
                    disabled={partnerNoteSent || !partnerNote.trim()}
                    onClick={submitPartnerNote}
                  >
                    {t('incidents.partnerNoteSubmit')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{t('incidents.supportTitle')}</CardTitle>
              <CardDescription>{t('incidents.supportHint')}</CardDescription>
            </CardHeader>
            <CardContent>
              {supportSent ? (
                <div className="space-y-3">
                  <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
                    {t('incidents.supportSuccess')}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="touch-manipulation"
                    onClick={() => {
                      setSupportSent(false)
                      setSupportTopic('')
                      setSupportBody('')
                      setSupportErr(false)
                    }}
                  >
                    {t('incidents.supportAnother')}
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={submitSupport}>
                  <div className="space-y-2">
                    <Label htmlFor="support-topic">{t('incidents.supportCategory')}</Label>
                    <select
                      id="support-topic"
                      value={supportTopic}
                      onChange={(e) => setSupportTopic(e.target.value)}
                      className={cn(
                        'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      )}
                    >
                      <option value="">{t('incidents.supportCategoryPlaceholder')}</option>
                      <option value="general">{t('incidents.supportCategoryGeneral')}</option>
                      <option value="docs">{t('incidents.supportCategoryDocs')}</option>
                      <option value="payment">{t('incidents.supportCategoryPayment')}</option>
                      <option value="other">{t('incidents.supportCategoryOther')}</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="support-msg">{t('incidents.supportMessage')}</Label>
                    <Textarea
                      id="support-msg"
                      value={supportBody}
                      onChange={(e) => {
                        setSupportBody(e.target.value)
                        if (supportErr) setSupportErr(false)
                      }}
                      rows={4}
                      placeholder={t('incidents.supportMessagePlaceholder')}
                      aria-invalid={supportErr}
                    />
                  </div>
                  {supportErr ? (
                    <p className="text-xs text-destructive">{t('incidents.supportMessageRequired')}</p>
                  ) : null}
                  <Button type="submit" className="touch-manipulation w-full sm:w-auto">
                    {t('incidents.supportSubmit')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
