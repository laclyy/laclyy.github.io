import assert from 'node:assert/strict'
import { normalizeUrl, sameUrl, isUsableUrl, guessFromUrl, finalizeVideo, emptyVideo, replaceVideo } from '../src/lib/adminVideo'
import FeaturedVideos from '../src/components/FeaturedVideos'
import HomePage from '../src/pages/HomePage'
import VideoForm from '../src/components/admin/VideoForm'
import VideoFilters from '../src/components/VideoFilters'
import { useFilteredVideos } from '../src/lib/videos'
import * as React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import profile from '../public/data/profile.json'

  const path = 'video-lacly/video/anime edits/sigma boys/nagi sigma boy(easy).mp4'
  const expected = 'https://vanzakart.net:8443/video-lacly/video/anime%20edits/sigma%20boys/nagi%20sigma%20boy%28easy%29.mp4'
  assert.equal(normalizeUrl(path), expected)
  assert.equal(normalizeUrl(`/${path}`), expected)
  assert.equal(normalizeUrl(expected), expected)
  assert.equal(normalizeUrl(`https://vanzakart.net:8443/${path}`), expected)
  assert.equal(sameUrl(path, expected), true)
  assert.equal(isUsableUrl(path), true)
  assert.equal(isUsableUrl('javascript:alert(1)'), false)
  assert.equal(isUsableUrl(''), false)
  assert.equal(normalizeUrl(''), '')
  assert.equal(normalizeUrl('video-lacly/gfx/caffè #1 & 100%.png'), 'https://vanzakart.net:8443/video-lacly/gfx/caff%C3%A8%20%231%20%26%20100%25.png')
  assert.equal(normalizeUrl('video-lacly/gfx/a%20b%28c%29.png'), 'https://vanzakart.net:8443/video-lacly/gfx/a%20b%28c%29.png')
  assert.equal(normalizeUrl('https://example.com/my video.mp4?token=a%2Bb&v=2#time'), 'https://example.com/my%20video.mp4?token=a%2Bb&v=2#time')
  assert.equal(normalizeUrl('https://www.youtube.com/watch?v=abc123'), 'https://www.youtube.com/watch?v=abc123')
  assert.equal(normalizeUrl('thumbnails/my cover.png'), 'thumbnails/my%20cover.png')
  assert.equal(normalizeUrl('videos/my edit.mp4'), 'videos/my%20edit.mp4')
  const guess = guessFromUrl(normalizeUrl(path))
  assert.equal(guess.title, 'nagi sigma boy')
  assert.equal(guess.difficulty, 'easy')
  assert.equal(guess.category, 'anime')
  assert.equal(guess.style, 'sigma boy')
  assert.equal(guess.thumbnailUrl, expected.replace('/video/', '/thumbnails/').replace('.mp4', '.png'))
  const saved = finalizeVideo({ ...emptyVideo(), videoUrl: path, thumbnailUrl: 'video-lacly/thumbnails/cover (easy).png', title: 'Nagi', subcategory: ' Blue Lock ' })
  assert.equal(saved.videoUrl, expected)
  assert.equal(saved.subcategory, 'Blue Lock')
  assert.equal(saved.thumbnailUrl, 'https://vanzakart.net:8443/video-lacly/thumbnails/cover%20%28easy%29.png')
  assert.equal(replaceVideo({ videos: [] }, null, saved).videos[0].subcategory, 'Blue Lock')
  assert.equal('subcategory' in finalizeVideo({ ...saved, subcategory: ' ' }), false)

  const videos = [1, 2, 3, 4].map((n) => ({ ...saved, title: `Project ${n}`, videoUrl: `https://example.com/${n}.mp4`, date: `2026-10-0${n}`, featured: false }))
  const render = (Component, list) => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Component, { profile, socials: {}, videos: list, loading: false, onOpen() {} })))
  const latest = render(FeaturedVideos, videos)
  assert.ok(latest.includes('Latest edits'))
  assert.ok(latest.includes('Open Project 4'))
  assert.ok(!latest.includes('Open Project 1'))
  assert.ok(latest.indexOf('Open Project 4') < latest.indexOf('Open Project 3'))
  const featured = render(FeaturedVideos, videos.map((v, i) => ({ ...v, featured: i === 0 })))
  assert.ok(featured.includes(profile.featuredTitle))
  assert.ok(featured.includes('Open Project 1'))
  assert.ok(!featured.includes('Open Project 4'))
  const home = render(HomePage, videos)
  assert.ok(home.indexOf(profile.contactTitle) < home.indexOf('Latest edits'))
  assert.ok(home.indexOf('Latest edits') < home.indexOf('Follow my work'))
  const filters = { category: 'anime', subcategory: 'Blue Lock', type: 'all', game: 'all', style: 'all', search: '', sort: 'date-desc' }
  const mixed = [saved, { ...saved, title: 'Other anime', subcategory: 'Other series' }, { ...saved, title: 'Game', category: 'videogiochi', subcategory: 'Game category' }]
  function FilterResult() {
    return React.createElement('p', null, useFilteredVideos(mixed, filters).map((video) => video.title).join(','))
  }
  assert.equal(renderToStaticMarkup(React.createElement(FilterResult)), '<p>Nagi</p>')
  const filterMarkup = renderToStaticMarkup(React.createElement(VideoFilters, { videos: mixed, filters, count: 1, onChange() {} }))
  assert.ok(filterMarkup.includes('Blue Lock'))
  assert.ok(filterMarkup.includes('Other series'))
  assert.ok(!filterMarkup.includes('Game category'))
  const formMarkup = renderToStaticMarkup(React.createElement(VideoForm, { original: saved, allVideos: mixed, onCancel() {}, async onSave() { return true } }))
  assert.ok(formMarkup.includes('value="Blue Lock" selected=""'))
  assert.ok(formMarkup.includes('value="Other series"'))
  assert.ok(!formMarkup.includes('value="Game category"'))
  console.log('Media checks passed: path encoding, autofill, saved subcategories, homepage selection and section order.')
