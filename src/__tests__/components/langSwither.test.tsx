import LangSwitcher from '@/src/components/LangSwitcher/LangSwitcher'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key, 
  useLocale: () => 'en',
}))

const replaceMock = vi.fn()
vi.mock('@/src/i18n/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/current-path',
}))

describe('LangSwitcher', () => {
  it('renders radio buttons with labels', () => {
    render(<LangSwitcher />)

    const enRadio = screen.getByLabelText('en') as HTMLInputElement
    const ruRadio = screen.getByLabelText('ru') as HTMLInputElement

    expect(enRadio).toBeInTheDocument()
    expect(enRadio.checked).toBe(true) 

    expect(ruRadio).toBeInTheDocument()
    expect(ruRadio.checked).toBe(false)

    
    expect(screen.getByText('lang:')).toBeInTheDocument()
  })

  it('calls router.replace on language change', async () => {
    render(<LangSwitcher />)
    const ruRadio = screen.getByLabelText('ru') as HTMLInputElement

    await userEvent.click(ruRadio)

    expect(replaceMock).toHaveBeenCalledWith('/current-path', { locale: 'ru' })
  })
})
