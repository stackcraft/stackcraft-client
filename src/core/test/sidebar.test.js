import { mount } from '@vue/test-utils'

import sidebar from '@/core/components/sidebar.vue'
import homeSvg from '@/core/assets/home.svg'

describe('Sidebar component test', () => {
  const menu = [
    {
      name: 'home',
      link: '/',
      icon: homeSvg,
    },
  ]
  // eslint-disable-next-line fp/no-let
  let cmp

  beforeEach(() => {
    cmp = mount(sidebar, {
      data() {
        return {
          menu,
        }
      },
    })
  })

  it('Received data for rendering menu in props', () => {
    expect(cmp.vm.menu).toEqual(menu)
  })

  it('Has expected HTML structure', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})
