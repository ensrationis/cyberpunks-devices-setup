# Source: Testing firmware update announcement, 2026-08-11

Internal announcement relayed by the project owner (author of the firmware
change, Robonomics team). Not public — kept here because Section 11 of the guide
("If the user is going to Testing firmware") is built on it.

Verified independently on 2026-08-11 against
https://webflasher.robonomics.network/ manifests: Testing builds are
`R-URB_2026-07-08` and `R-INS_2026-07-08`, commit `3e2ed16`; Stable at the same
moment was `R-URB_2026-06.1` / `R-INS_2026-06.1`, commit `d1623eb`. The dev
branch (`esp32-dev`) is what CI publishes as Testing.

## Encryption of values

Reference:
https://github.com/airalab/robonomics/tree/master/frame/cps#-encryption-format
and `#how-encryption-works` in the same document.

Every device config has an `owner` (`rws_owner`) field. Values are always
encrypted to the public key of that address:

- **Owner set** (a person's address, or a group master) — only the holder of
  that address's secret key can read the values.
- **Owner standalone** — the device encrypts to itself (self-owner).

Example, a group where Urban is the master:

- Urban — *Create group* / *Standalone-master* → owner = Urban itself
  (self-owner); Urban's values are encrypted with Urban's key.
- Insight — *Join group* → owner = Urban's address; Insight's values are also
  encrypted with Urban's key.
- So one Urban key decrypts Urban, Insight and any other follower with the same
  owner.

Decryption on the sensors map: log in with the owner's mnemonic, or import an
owner-access JSON or a device backup.

**Important:** with a manual / external owner, a device backup will *not*
decrypt the measurements on the map — the backup contains the device key while
the data is encrypted to the external owner, so that owner's mnemonic/key is
required. The backup is still valid for restoring device settings.

How it works, in short: the device combines its own secret key with the owner's
public key to derive a shared secret (the owner derives the same secret from
their secret key and the device's public key — the secret never travels over the
network). The value (e.g. `"850"`) is encrypted with that shared key, with a
fresh random nonce each time and an integrity check. Instead of the number, the
stream carries `e.<base64(JSON)>`, where the JSON holds the device address (SS58
`from`), the nonce and the ciphertext. The owner reverses this on the map and
sees `850` again. Without the owner's key the field stays unreadable.

## New web interface

- Mobile-app-like interface with four areas: **altruist.local** (device readings
  and settings), **sensors.social** (everything map-related), **Custom**
  (HA / API / Influx / CSV), **System** (debug, restart, backup, delete config).
- Sidebar on desktop, bottom tabs on phone.
- The captive portal for first Wi-Fi setup is the same in meaning but tidier:
  steps 1 → 2, "Finish setup", with hints.

## Backup and restore

- **System → Backup & restore** — full settings backup, including the owner key
  if present; restore replaces the config and restarts the device.
- The same file can be used to log in on sensors.map.
- On the device's guest Wi-Fi, restore is available before it joins the home
  network, at `/guest-restore` — convenient right after a reset.

## Smaller changes

- Unique names on the network: `altruist-insight-<id>` / `altruist-urban-<id>`.
- Fixed a bug where the config was not saved after Wi-Fi / setup (`writeConfig`).
