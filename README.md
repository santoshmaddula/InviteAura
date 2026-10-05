# InviteAura — Premium Indian Wedding Invitation Builder MVP

This version is tailored to the Atrivarada Sri Bhaskara Sharma & Renuka sample invitation.

## Included
- Premium emerald / antique-gold visual system
- South Indian / Telugu-inspired decorative language
- Cinematic multi-page mobile preview
- Couple photo upload preview
- Background music upload control (local MVP preview hook)
- Marriage and reception events with separate dates
- Countdown to Muhurtham
- Template gallery
- Live invitation editor
- Pricing/monetization section
- Demo publish ID

## Sample data
Muhurtham: 9:56 PM, 21 November 2026, Vijayawada
Reception: 5 December 2026, 7:00 PM onwards, Vijayawada

## Run
python3 -m http.server 8000
Open http://localhost:8000

## Production architecture
Recommended next stack:
- Next.js + TypeScript
- PostgreSQL
- Object storage (Azure Blob/S3)
- Razorpay
- Authentication
- Invitation slug service
- QR code generator
- Server-side image optimization
- Admin dashboard
- Template JSON schema
- Customer dashboard
- Analytics

The demo publish action intentionally does not claim to create a persistent public URL.


## South Indian visual assets
Includes SVG motifs for gopuram, mango-leaf thoranam, kolam, brass diya and temple bells, used directly in the invitation UI.
