import { Calendar, ChevronRight, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { IncidentRecord } from '@/features/claim/schemas'
import { formatIncidentDate, incidentStatusBadgeVariant } from '@/features/incidents/incidentUi'

type IncidentCardsSectionProps = {
  incidents: IncidentRecord[]
}

export function IncidentCardsSection({ incidents }: IncidentCardsSectionProps) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language.startsWith('tr') ? 'tr-TR' : 'en-US'

  function copy(id: string, field: 'title' | 'summary' | 'location'): string {
    return t(`incidents.byId.${id}.${field}`)
  }

  return (
    <section className="mt-10 text-left" aria-labelledby="incidents-heading">
      <div className="mb-4 space-y-1">
        <h2 id="incidents-heading" className="text-lg font-semibold tracking-tight">
          {t('incidents.sectionTitle')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('incidents.sectionSubtitle')}</p>
      </div>

      {incidents.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {t('incidents.empty')}
          </CardContent>
        </Card>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {incidents.map((inc) => (
            <li key={inc.id}>
              <Link
                to={`/incidents/${inc.id}`}
                className="group block h-full rounded-xl outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full shadow-none transition group-hover:border-primary/50 group-hover:bg-muted/20">
                  <CardHeader className="space-y-3 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary">
                        {copy(inc.id, 'title')}
                      </CardTitle>
                      <Badge variant={incidentStatusBadgeVariant(inc.statusKey)}>
                        {t(`incidents.status.${inc.statusKey}`)}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm leading-relaxed">
                      {copy(inc.id, 'summary')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0 text-sm text-muted-foreground">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="sr-only">{t('incidents.dateLabel')}: </span>
                        {formatIncidentDate(inc.occurredAt, locale)}
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="sr-only">{t('incidents.locationLabel')}: </span>
                        <span className="truncate">{copy(inc.id, 'location')}</span>
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-primary">
                      {t('incidents.openDetail')}
                      <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
