const TIKTOK_URL = "https://www.tiktok.com/@ditsc.com";
const FACEBOOK_URL = "https://www.facebook.com/digginginthesalescrates/";

export default function FollowUs() {
  return (
    <div className="follow-us-section" style={{ justifyContent: 'center' }}>
      <span className="follow-us-label">follow ditsc</span>
      <div className="follow-us-links">
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="follow-pill follow-pill--tiktok"
          aria-label="Follow DITSC on TikTok"
        >
          <TikTokIcon />
          @ditsc.com
        </a>
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="follow-pill follow-pill--facebook"
          aria-label="Follow DITSC on Facebook"
        >
          <FacebookIcon />
          Digging in the Sales Crates
        </a>
      </div>
    </div>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 12 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 0.5C9.2 2.5 10.5 3.5 12 3.7v2.1c-1.2-.1-2.3-.5-3.2-1.2v5.4c0 2.2-1.8 4-4 4S.8 12.2.8 10 2.6 6 4.8 6c.2 0 .4 0 .6.1V8.3c-.2-.1-.4-.1-.6-.1-1 0-1.8.8-1.8 1.8s.8 1.8 1.8 1.8 1.8-.8 1.8-1.8V.5H9z"
        fill="currentColor"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 12 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7.5 7.5H9.5L10 5H7.5V3.5C7.5 2.9 7.8 2.5 8.5 2.5H10V0.3C9.6 0.2 8.9 0 7.9 0 5.9 0 4.5 1.3 4.5 3.3V5H2.5v2.5H4.5V14H7.5V7.5z"
        fill="currentColor"
      />
    </svg>
  );
}
