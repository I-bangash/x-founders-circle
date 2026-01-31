import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface UserNotificationEmailProps {
  userName: string;
  appName: string;
  appUrl: string;
}

export function UserNotificationEmail({
  userName,
  appName,
  appUrl,
}: UserNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Notification from {appName}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[580px] py-5">
            <Section className="mb-6">
              <Img
                src={`${appUrl}/logo.png`}
                width="36"
                height="36"
                alt={`${appName} logo`}
              />
            </Section>
            <Section className="rounded-lg bg-gray-50 p-8">
              <Heading className="mt-4 text-2xl leading-tight font-normal text-gray-700">
                Hello {userName},
              </Heading>
              <Text className="mb-4 text-base leading-relaxed text-gray-600">
                This is a sample notification email from {appName}.
              </Text>
              <Text className="mb-4 text-base leading-relaxed text-gray-600">
                Update this template to match your product messaging, add links,
                or include custom content as needed.
              </Text>
              <Text className="mt-12 text-sm text-gray-500">
                Cheers,
                <br />
                The {appName} Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
