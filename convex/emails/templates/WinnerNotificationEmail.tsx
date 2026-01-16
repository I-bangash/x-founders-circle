// "use node";

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface WinnerNotificationEmailProps {
  winnerName: string;
  giveawayName: string;
  totalPoints: number;
  referralPoints: number;
  winTimestamp: number;
  claimUrl?: string;
}

export function WinnerNotificationEmail({
  winnerName,
  giveawayName,
  totalPoints,
  referralPoints,
  winTimestamp,
  claimUrl,
}: WinnerNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Congratulations! You&apos;re a Winner! 🎉</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto max-w-[580px] py-5">
            <Section className="mb-6">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                width="36"
                height="36"
                alt="ViralLaunch"
              />
            </Section>
            <Section className="rounded-lg bg-gray-50 p-8">
              <Heading className="mt-4 text-2xl font-normal leading-tight text-gray-700">
                Congratulations {winnerName}! 🎉
              </Heading>
              <Text className="mb-4 text-base leading-relaxed text-gray-600">
                Great news! You&apos;ve won the "{giveawayName}" giveaway
              </Text>
              <Section className="my-6 rounded-lg border border-gray-200 bg-white p-6">
                <Text className="mb-3 text-base font-semibold text-black">
                  Your Winning Stats:
                </Text>
                <Text className="text-sm leading-relaxed text-gray-600">
                  🎯 Total Points: {totalPoints}
                  <br />
                  👥 Referral Points: {referralPoints}
                  <br />
                  📅 Won on: {new Date(winTimestamp).toLocaleDateString()}
                </Text>
              </Section>
              {claimUrl && (
                <Section className="my-6 text-center">
                  <Link
                    href={claimUrl}
                    className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-base font-medium text-white no-underline"
                  >
                    Claim Your Prize
                  </Link>
                </Section>
              )}
              <Text className="mb-4 text-base leading-relaxed text-gray-600">
                Thanks a ton for jumping in! We hope you had a blast!
              </Text>
              <Text className="mt-12 text-sm text-gray-500">
                Cheers,
                <br />
                The ViralLaunch Team
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
