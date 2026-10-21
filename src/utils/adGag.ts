/**
 * The joke played when someone clicks an ad button (R126), step by step:
 * idle → fake camera request → GIF « C'était une fausse pub » → idle.
 */
export type GagStage = 'idle' | 'permission' | 'gif'

export type GagEvent = 'adClicked' | 'permissionAnswered' | 'gifClosed'

export function nextGagStage(stage: GagStage, event: GagEvent): GagStage {
  if (event === 'adClicked' && stage === 'idle') return 'permission'
  if (event === 'permissionAnswered' && stage === 'permission') return 'gif'
  if (event === 'gifClosed' && stage === 'gif') return 'idle'
  // Any other event changes nothing (e.g. a second click while the joke is running).
  return stage
}
