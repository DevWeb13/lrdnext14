// components/email-template.tsx

import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailTemplateProps {
  userName?: string;
  link?: string;
  previewText?: string;
  sectionText?: string;
  buttonText?: string;
  footerIntroText?: string;
}

const baseUrl = 'https://lrdnext14.vercel.app/';

export const EmailTemplate = ({
  userName = '',
  link = '',
  previewText = '',
  sectionText = '',
  buttonText = '',
  footerIntroText = '',
}: EmailTemplateProps) => {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}logoLRD.svg`}
            width="50"
            height="50"
            alt="Dropbox"
          />
          <Section>
            <Text style={text}>Bonjour {userName},</Text>
            <Text style={text}>{sectionText}</Text>

            <Button style={button} href={link}>
              {buttonText}
            </Button>
            <Text style={text}>{footerIntroText}</Text>
            <Text style={text}>
              Pour assurer la sécurité de votre compte, veuillez ne pas
              transférer cet e-mail à qui que ce soit.
            </Text>
            <Text style={text}>Bon développement</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};
