---
name: lab-build
description: Hand a drafted lab (labs/<slug>/ from /lab) to Lab Builder — plan the vCloud Director vApp (golden images, networks, gateway, edge firewall from SETUP.md), write lab.yaml + PLAN.md there, run terraform plan, and STOP for approval. Never applies.
---

Plan the vApp that hosts one drafted lab. `$ARGUMENTS` is the lab slug
(e.g. `/lab-build broken-path`), i.e. `labs/<slug>/` in this learning-path repo
as written by `/lab` and cleaned by `/lab-review`. The build itself happens in
the **Lab Builder** repo (https://github.com/willrobertson23wwt/Lab-Builder),
which owns the Terraform module, the designer UI and the per-lab state.

## 0. Find Lab Builder

```bash
LB="${LAB_BUILDER_ROOT:-$(dirname "$(dirname "$(readlink "$(command -v lab-builder)" 2>/dev/null || echo /nonexistent/x/x)")")}"
[ -f "$LB/bin/lab-builder" ] || LB="$HOME/ClaudeCode/lab-automation"
[ -f "$LB/.env" ] || echo "Lab Builder not set up"
```

If it is not installed: tell the user to clone the repo, run `scripts/setup.sh`,
fill in `.env`, run `bin/lab-builder install`, and stop. Do not try to build the
vApp any other way.

## 1. Read the drafted lab

- `labs/<slug>/environment.md`: device table (hosts, OS, lab and management
  addresses, roles), who the learner logs into.
- `labs/<slug>/SETUP.md`: the **vApp edge firewall** table, interface map,
  port forwards (2210/2211 style), gateway VM duties, sizing hints.
- `labs/<slug>/index.md` title -> `description`.
- CLAUDE.md's **Platform profile** for the default OS when the guide is silent.

## 2. Pick images

`python3 "$LB/scripts/catalog_match.py" --json "<os/role words>" ...` once for
all hosts. Report each match. If a host has no match, say so and offer the
nearest name from `--list`; never invent a template name.

## 3. Lay out the vApp (Lab Builder house pattern)

- Networks: `Gateway` (`routed: true`, `192.168.2.0/30`, gateway `.1`, pool
  `.2-.2`), plus one isolated network per subnet in the guide (`Lab`,
  `Management`, ...) with `gateway` = the gateway VM's address there.
- `gateway` VM: `kind: gateway`, latest Ubuntu server image, NIC0 `Gateway`
  `mode: POOL`, then one `mode: DHCP` NIC per isolated network. It does all
  NAT, DNS and port forwarding for the lab (Ansible, later).
- Every other VM: MANUAL NICs with the guide's addresses (`ip:`), in the
  guide's interface order (eth0 = lab, eth1 = management).
- `edge_nat: {mode: ip_translation, vm: gateway}`.
- Edge firewall: if SETUP.md has the table,
  `python3 "$LB/scripts/setup_rules.py" labs/<slug>/SETUP.md --gateway gateway --yaml`
  and paste the `edge_firewall:` block. Otherwise the house preset (default
  drop, allow all external→internal, allow all internal→external).

Schema and examples: `$LB/labs/README.md`.

## 4. Write it into Lab Builder

- `$LB/labs/<slug>/lab.yaml` with `vapp_name: lab-<slug>`. First check the name
  is free: `python3 "$LB/scripts/discover.py" --vapp lab-<slug>` must print
  "No vApps matched".
- `$LB/labs/<slug>/PLAN.md`: VM table (image, sizing, NICs/addresses), network
  table, firewall table, what Terraform does NOT do (guest config, seeded
  state, gateway nftables), every assumption made where the guide was silent.
- `cp -R "$LB/terraform/lab-root" "$LB/labs/<slug>/terraform"` if missing.

## 5. Plan, then STOP

```bash
"$LB/bin/lab-builder" plan <slug>
```

Report the plan summary (a new lab must show 0 to change, 0 to destroy) and
where `PLAN.md` is. Then stop. Building is the user's call:
`lab-builder build <slug>` in a terminal, or Apply in `lab-builder ui`. After the
build, `lab-builder status <slug>` shows the vApp; SETUP.md's guest steps are
applied afterwards with the lab repo's Ansible.
