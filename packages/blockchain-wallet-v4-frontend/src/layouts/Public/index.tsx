import React, { ComponentType } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { formValueSelector } from 'redux-form'
import styled, { css } from 'styled-components'

import Alerts from 'components/Alerts'
import { selectors } from 'data'
import { LoginSteps } from 'data/types'
import ErrorBoundary from 'providers/ErrorBoundaryProvider'
import { media } from 'services/styles'

import Modals from '../../modals'
import Footer from './components/Footer'
// import AndroidAppBanner from './components/AndroidAppBanner'
import Header from './components/Header'

const FooterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin: 6rem 0 2rem;
  ${media.mobile`
    flex-direction: column;
    margin-top: 8px;
  `}
`

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.grey900};
  height: auto;
  min-height: 100%;
  width: 100%;
  overflow: auto;

  ${media.atLeastTablet`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  `}
`

const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
`
const ContentContainer = styled.div<{ isLogin?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0 16px;

  ${(props) =>
    props.isLogin &&
    css`
      margin-top: 40px;
    `}
`

const PublicLayoutContainer = ({
  component: Component,
  exact = false,
  loginParam,
  loginStep,
  path
}: Props) => {
  const isLogin = path === '/login'
  const isFirstLoginStep = isLogin && loginStep === LoginSteps.ENTER_EMAIL_GUID
  const isSecondLoginStep =
    isLogin &&
    (loginStep === LoginSteps.VERIFICATION_MOBILE || loginStep === LoginSteps.ENTER_PASSWORD)
  return (
    <Route
      path={path}
      exact={exact}
      render={(matchProps) => (
        <ErrorBoundary>
          <Wrapper>
            {/* TODO: STILL NEEDS DEV/QA */}
            {/* <AndroidAppBanner /> */}
            <Alerts />

            <HeaderContainer>
              <Header loginParam={loginParam} />
            </HeaderContainer>

            <Modals />
            <ContentContainer isLogin={isLogin}>
              <Component {...matchProps} />
            </ContentContainer>

            <FooterContainer>
              <Footer isFirstLoginStep={isFirstLoginStep} isSecondLoginStep={isSecondLoginStep} />
            </FooterContainer>
          </Wrapper>
        </ErrorBoundary>
      )}
    />
  )
}

type Props = {
  component: ComponentType<any>
  exact?: boolean
  loginParam?: string
  loginStep: LoginSteps
  path: string
}

const mapStateToProps = (state) => ({
  loginParam: selectors.auth.getLoginParam(state) as string,
  loginStep: formValueSelector('login')(state, 'step')
})

const connector = connect(mapStateToProps)

export default connector(PublicLayoutContainer)
