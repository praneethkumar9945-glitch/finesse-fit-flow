create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  goal text,
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  duration_minutes int not null default 45,
  intensity text not null default 'Medium',
  image_url text,
  seats int not null default 20,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tagline text not null default '',
  price_inr int not null,
  period text not null default 'month',
  features jsonb not null default '[]'::jsonb,
  highlight boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  class_id uuid not null references public.classes(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  activity_type text not null default 'workout',
  duration_minutes int not null default 0,
  calories_burned int not null default 0,
  performed_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant select on public.classes to anon, authenticated;
grant select on public.membership_plans to anon, authenticated;
grant select, insert, update, delete on public.bookings to authenticated;
grant select, insert, update, delete on public.workout_logs to authenticated;
grant all on public.profiles, public.classes, public.membership_plans, public.bookings, public.workout_logs to service_role;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.membership_plans enable row level security;
alter table public.bookings enable row level security;
alter table public.workout_logs enable row level security;

create policy "Users can read their own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "Anyone can view classes" on public.classes for select to anon, authenticated using (true);
create policy "Anyone can view membership plans" on public.membership_plans for select to anon, authenticated using (true);
create policy "Users can view their own bookings" on public.bookings for select to authenticated using (auth.uid() = user_id);
create policy "Users can create their own bookings" on public.bookings for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own bookings" on public.bookings for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own bookings" on public.bookings for delete to authenticated using (auth.uid() = user_id);
create policy "Users can view their own workout logs" on public.workout_logs for select to authenticated using (auth.uid() = user_id);
create policy "Users can create their own workout logs" on public.workout_logs for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own workout logs" on public.workout_logs for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own workout logs" on public.workout_logs for delete to authenticated using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.classes (name, category, description, duration_minutes, intensity, image_url, sort_order) values
('HIIT Inferno', 'Strength', 'Explosive intervals of battle ropes, box jumps and bodyweight burners that torch calories long after you leave the floor.', 45, 'High', '/images/classes/hiit.jpg', 1),
('Power Yoga Flow', 'Yoga', 'A dynamic vinyasa sequence building strength and mobility, closing with deep guided breathwork.', 60, 'Low', '/images/classes/yoga.jpg', 2),
('Strength Foundations', 'Strength', 'Coach-led barbell fundamentals — squat, deadlift and press technique with progressive overload programming.', 60, 'Medium', '/images/classes/strength.jpg', 3),
('Boxing Burn', 'Boxing', 'Pad work, footwork drills and heavy bag rounds for total-body conditioning and stress relief.', 50, 'High', '/images/classes/boxing.jpg', 4),
('Spin Sprint', 'Cardio', 'Rhythm-driven indoor cycling with climbing intervals and sprint finishes in a high-energy studio.', 45, 'High', '/images/classes/spin.jpg', 5),
('Zumba Party', 'Dance', 'Latin-inspired dance cardio that feels like a night out — no dance experience needed.', 45, 'Medium', '/images/classes/zumba.jpg', 6),
('CrossFit Engine', 'Strength', 'Constantly varied functional training — olympic lifts, metcons and engine building at your own pace.', 60, 'High', '/images/classes/crossfit.jpg', 7),
('Sunset Vinyasa', 'Yoga', 'A slow evening flow to unwind the day, restore mobility and sleep deeper.', 45, 'Low', '/images/classes/yoga.jpg', 8);

insert into public.membership_plans (name, tagline, price_inr, period, features, highlight, sort_order) values
('Starter', 'Perfect for getting into the groove', 999, 'month', '["Gym floor access", "4 group classes per month", "Body composition assessment", "Mobile app access"]'::jsonb, false, 1),
('Pro', 'Our most popular plan', 1699, 'month', '["Unlimited group classes", "All-access gym floor", "Personalised diet plan", "Monthly trainer consultation", "Progress tracking dashboard"]'::jsonb, true, 2),
('Elite', 'For serious transformation', 2499, 'month', '["Everything in Pro", "4 personal training sessions", "Priority class booking", "Recovery & spa access", "Dedicated coach support"]'::jsonb, false, 3);