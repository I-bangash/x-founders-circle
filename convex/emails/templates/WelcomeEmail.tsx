import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName?: string;
  userEmail?: string;
  loginUrl?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}`
  : "https://virallaunch.ai";

export const WelcomeEmail = ({
  userName = "Founder",
  loginUrl = `${baseUrl}/sign-in`,
}: WelcomeEmailProps) => {
  const previewText = `Welcome to ViralLaunch. Let's get to work.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[580px] py-5">
            <Section className="rounded-lg bg-gray-50 p-8">
              <Heading className="mt-4 text-2xl leading-tight font-bold text-gray-700">
                You just joined something special.
              </Heading>
              <Text className="text-base leading-relaxed text-gray-600">
                I&apos;m not going to lie - I get way too excited about every
                signup.
              </Text>
              <Text className="text-base leading-relaxed text-gray-600">
                Right now I&apos;m on my fourth coffee, doing a little victory
                dance that my neighbor definitely heard through the wall.
              </Text>
              <Text className="text-base leading-relaxed text-gray-600">
                Here&apos;s the thing: You&apos;re not just another email in my
                database. You&apos;re a founder with something incredible to
                share. And most founders? They build amazing things that nobody
                ever discovers.
              </Text>
              <Text className="text-base leading-relaxed text-gray-600">
                Not you. Not on my watch.
              </Text>
              <Text className="text-base leading-relaxed text-gray-600">
                I built ViralLaunch because I was sick of great products failing
                due to lack of visibility. You&apos;ve got the hard part done -
                you built something people need. Now let&apos;s get them to see
                it.
              </Text>
              <Text className="text-base leading-relaxed text-gray-600">
                Your mission: Take one, single action right now that will get
                you closer to your goal. Generate your first launch tweet. Find
                your ideal persona. Create a viral giveaway. Whatever.
                Let&apos;s just move.
              </Text>
              <Section className="my-8 text-center">
                <Button
                  className="inline-block rounded-md bg-black px-6 py-3 text-base font-medium text-white no-underline"
                  href={loginUrl}
                >
                  Go Get Customer #1
                </Button>
              </Section>
              <Text className="text-base leading-relaxed text-gray-600">
                If you get stuck, hit reply to this email. It goes directly to
                me. Tell me what sucks, what you love, or if you just need a
                second opinion on a domain name. I read everything.
              </Text>
              <Text className="text-base leading-relaxed text-gray-600">
                Time to make some noise,
                <br />
                Bangash
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
