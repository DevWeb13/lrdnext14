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

interface ResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
}

const baseUrl = 'https://demo.react.email/';

export const ResetPasswordEmail = ({
  userFirstname = 'destinataire',
  resetPasswordLink = 'https://dropbox.com',
}: ResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Réinitialiser votre mot de passe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/static/dropbox-logo.png`}
            width='40'
            height='33'
            alt='Dropbox'
          />
          <Section>
            <Text style={text}>Bonjour {userFirstname},</Text>
            <Text style={text}>
              Quelqu&apos;un a récemment demandé un changement de mot de passe
              pour votre compte LaReponseDev. Si c&apos;est votre cas, vous
              pouvez définir un nouveau mot de passe ici :
            </Text>

            <Button
              style={button}
              href={resetPasswordLink}>
              Réinitialiser le mot de passe
            </Button>
            <Text style={text}>
              Si vous ne souhaitez pas modifier votre mot de passe ou si vous ne
              l&apos;avez pas demandé, ignorez et supprimez simplement ce
              message.
            </Text>
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

export default ResetPasswordEmail;

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

const anchor = {
  textDecoration: 'underline',
};
