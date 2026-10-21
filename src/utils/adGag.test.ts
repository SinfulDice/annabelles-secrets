import { describe, expect, it } from 'vitest'
import { nextGagStage, type GagEvent } from './adGag'

const play = (...events: GagEvent[]) => events.reduce(nextGagStage, 'idle' as const)

describe('R126 the ad joke', () => {
  it('a click on an ad button opens the fake camera request', () => {
    expect(play('adClicked')).toBe('permission')
  })

  it('answering it (Autoriser, Bloquer or Escape) shows the GIF', () => {
    expect(play('adClicked', 'permissionAnswered')).toBe('gif')
  })

  it('closing the GIF ends the joke', () => {
    expect(play('adClicked', 'permissionAnswered', 'gifClosed')).toBe('idle')
  })

  it('a second click during the joke does not restart it', () => {
    expect(play('adClicked', 'permissionAnswered', 'adClicked')).toBe('gif')
  })

  it('events in the wrong order change nothing', () => {
    expect(play('permissionAnswered', 'gifClosed')).toBe('idle')
  })
})
