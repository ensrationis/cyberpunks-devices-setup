# Source: "Altruist: A Trustless DePIN Use Case" — X thread, 25–26 Feb 2025

Author: Sergei Lonshakov (@EnsRationis), Robonomics/Airalab founder.
Thread root: https://x.com/EnsRationis/status/1894397199078810064

This is the source for **Section 15 of the guide** ("How the sensor network
works"). Kept here because x.com is behind a login wall — the thread cannot be
re-fetched by a tool later. Retrieved 2026-08-11; text reproduced from the
public thread for provenance, lightly trimmed of promo lines.

---

**0/ (root)** — Altruist: A Trustless DePIN Use Case. The image illustrates the
principle architecture of how the Altruist home sensor connects to the user
application, leveraging Polkadot World Computer and Robonomics.network.
*(Attached: architecture diagram — see the box/arrow transcript at the bottom.)*

**1/ Altruist** — an open-source device designed from circuit board layout to
firmware by the Robonomics team. Measures air quality, indoor climate and noise.
Hardware: github.com/airalab/hardware · Firmware: github.com/airalab/altruist-firmware

**2/ Robonomics app** — the user application, accessible from any browser with
Polkadot.js support or via a mobile app such as Nova Wallet.

**3/ Robonomics IoT Cloud Provider** — functions as the Robonomics Rollup
collator, aggregating extrinsics from the Robonomics network into blocks and
forwarding them to Polkadot validators. Integration with the Connectivity
Provider is planned; for now these remain separate entities.
Source: github.com/airalab/robonomics

**4/ Robonomics Connectivity Provider** — manages two data flows: (a) real-time
data relay, (b) blockchain-based storage of historical sensor data. Only
processes messages from accounts with an active Robonomics subscription.
Source: github.com/airalab/sensors-connectivity

**5/ IPFS node / Crust / Pinata** — three off-chain storage options: a local
IPFS node on the Connectivity Provider; cloud storage via Pinata (API support
added to the Connectivity Provider); direct integration with Crust providers
(needs a small Crust token balance). Planned: XCM integration so all Robonomics
data lands in Crust automatically via cross-chain requests.

**6/ Polkadot World Computer** — the cloud data center, ensuring immutable
storage of historical measurements. Digital twins inside it guarantee data
authentication during relay, control signal latency, and enable identity,
access control and backup features. For Altruist the focus is securing
historical data.

**7/ RoSeMAN (analytics service)** — retrieving history directly from the
blockchain proved slow, expensive and impractical, so RoSeMAN subscribes to new
events from the Robonomics Rollup, fetches data from IPFS, and stores it in a
relational database for fast sensor-map queries.
Source: github.com/airalab/RoSeMAN

**8/ Data flow — from Altruist to the user application**

1. **IoT subscription activation.** The user burns a small amount of XRT to
   activate an IoT subscription. Once active, devices and zero-balance users can
   be added and send transactions every 10 minutes. The Altruist's address is
   added to the subscription.
2. **Adding Altruist to the subscription.** The device can then send extrinsics
   with data values to Polkadot World Computer via any Robonomics IoT Cloud
   Provider (rollup collator).
3. **Signing messages for relay.** Altruist also signs messages with its private
   keys for the Robonomics Connectivity Provider.
4. **Data processing & relay.**
   (4.1) The Connectivity Provider relays messages from subscribed devices —
   this is the real-time data on sensors.social.
   (4.2) It aggregates data from multiple sensors and stores it in IPFS.
   (4.3) It takes the IPFS data hash and sends an extrinsic to the Robonomics
   IoT Cloud Provider — a permanent historical data sealing process.
5. **Recording data in the blockchain.** The IoT Cloud Provider performs no
   complex computation; it prepares "raw" data blocks for the network.
6. **Finalization by Polkadot validators.** Once the block is finalized, all
   active RoSeMAN instances receive an event with the new data.
7. **RoSeMAN retrieval & storage.** RoSeMAN queries IPFS by the received hashes,
   fetches off-chain data from dozens of sensors, stores it locally for fast
   access.
8. **User access to historical data.** In the Robonomics app users switch
   between real-time and historical data; a history request goes to RoSeMAN.
9. **Direct blockchain access.** Users can also read data directly from Polkadot
   World Computer, but since this needs multiple RPC calls, direct historical
   access is limited to the past 24 hours.

**9/** All service code: github.com/airalab · Course on building your own sensor
network: robonomics.academy/en/learn/sensors-connectivity-course/overview/ ·
"This is not just theory — a fully operational Web3 scenario after five years of
work."

**10/** Corrected diagram posted ("fixed a silly nighttime error with 9.2, which
of course doesn't even exist") — in the corrected version the app→IPFS arrow
labelled *(9.2) Retrieve data by hashes* is gone, and *(9.1)* becomes *(9) Get
historical data hashes from the last 24 hours*. **The corrected diagram is
authoritative.**

**11/** A designed/illustrated version of the same diagram by @Anna_Wimmer_S.
In that final version the connectivity box is labelled **"Sensors Connectivity
Provider"** (matching the repo name `airalab/sensors-connectivity`), and arrow
(9) reads "Get historical data from the last 24 hours".

Screenshots of the whole thread, including both diagrams in full resolution, are
in `Architecture of the network/Tweets/` in this repository (untracked).

---

## Diagram transcript (corrected version, tweet 10/)

Boxes: `Altruist` · `Robonomics Connectivity Provider` · `Robonomics IoT Cloud
provider (Robonomics Rollup collator)` · `Polkadot World Computer` · `IPFS node
/ Crust / Pinata` · `RoSeMAN (Analytics service)` · `Robonomics app (PWA)`

| Arrow | From → To |
|---|---|
| (1) RWS subscription interactions | Robonomics app → Polkadot World Computer |
| (2) Signed extrinsic | Altruist → Robonomics IoT Cloud provider |
| (3) Signed msg | Altruist → Robonomics Connectivity Provider |
| (4.0) Other sensors in the network | other sensors → Connectivity Provider |
| (4.1) Real time data (ipfs pubsub) | Connectivity Provider → Robonomics app |
| (4.2) Batch of the sensors data | Connectivity Provider → IPFS node / Crust / Pinata |
| (4.3) Batch of sensors data hash | Connectivity Provider → IoT Cloud provider |
| (5) Data blocks | IoT Cloud provider → Polkadot World Computer |
| (6) Retrieve events containing data hashes | Polkadot World Computer → RoSeMAN |
| (7) Load data into the local database | RoSeMAN → IPFS node / Crust / Pinata |
| (8) Request historical data | Robonomics app → RoSeMAN |
| (9) Get historical data hashes from the last 24 hours | Robonomics app → Polkadot World Computer |
