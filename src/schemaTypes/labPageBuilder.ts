import { defineArrayMember, defineType } from 'sanity'

export const labPageBuilderType = defineType({
  name: 'labPageBuilder',
  type: 'array',
  title: 'Lab blocks',
  description:
    'Add blocks for the Lab page. Production blocks: Hero, Media text, Card grid, Carousel, Proof points, Icon grid. Lab: Card grid (media + text inside), Full bleed vertical carousel, Rotating media, Media zoom out on scroll.',
  of: [
    defineArrayMember({ type: 'hero' }),
    defineArrayMember({ type: 'mediaTextStacked' }),
    defineArrayMember({ type: 'mediaText5050' }),
    defineArrayMember({ type: 'labCardGrid' }),
    defineArrayMember({ type: 'carousel' }),
    defineArrayMember({ type: 'fullBleedVerticalCarousel' }),
    defineArrayMember({ type: 'rotatingMedia' }),
    defineArrayMember({ type: 'mediaZoomOutOnScroll' }),
    defineArrayMember({ type: 'iconGrid' }),
    defineArrayMember({ type: 'proofPoints' }),
    defineArrayMember({ type: 'list' }),
  ],
})
