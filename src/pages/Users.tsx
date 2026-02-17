import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { FormInput } from '../components/ui/FormInput'
import { ResponsiveTable } from '../components/ui/ResponsiveTable'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers } from '../hooks/useUsers'
import type { UserDto } from '../api/types'
import { useAuth } from '../features/auth/AuthContext'
import { useNavigate } from 'react-router-dom'

type FormValues = {
  id?: string
  fullName: string
  email: string
  password: string
  role: 'admin' | 'staff' | 'user'
}

export function UsersPage() {
	const {user, loading} = useAuth()
	const { data, isLoading, error } = useUsers()
	const visibleUsers =
		data?.filter((u) => u.role !== 'admin' && !(user?.role === 'staff' && u.role === 'staff')) ?? []
	const createUser = useCreateUser()
	const updateUser = useUpdateUser()
	const deleteUser = useDeleteUser()
	const navigate = useNavigate()

	useEffect(()=>{
		if (user?.role === 'user'){
			navigate('/rooms', {replace:true})
			return
		}
	}, [loading, navigate, user])

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		formState: { isSubmitting },
	} = useForm<FormValues>({
		defaultValues: { fullName: '', email: '', password: '', role: 'staff' },
	})

	const canManage = user?.role === 'admin' || user?.role === 'staff'

	const onSubmit = async (values: FormValues) => {
		if (!canManage) {
			return
		}
		if (values.id) {
			const payload: UserDto & { password?: string } = {
				id: values.id,
				fullName: values.fullName,
				email: values.email,
				role: values.role,
				...(values.password ? { password: values.password } : {}),
			}
			await updateUser.mutateAsync(payload)
		} else {
			await createUser.mutateAsync({
				fullName: values.fullName,
				email: values.email,
				role: values.role,
				password: values.password,
			})
		}
		reset({ fullName: '', email: '', password: '', role: 'staff', id: undefined })
	}

	const onEdit = (user: UserDto) => {
		setValue('id', user.id)
		setValue('fullName', user.fullName)
		setValue('email', user.email)
		setValue('role', user.role)
		setValue('password', '')
	}

	const onDelete = async (id: string) => {
		if (!canManage) return
		await deleteUser.mutateAsync(id)
	}

	useEffect(() => {
		if (createUser.isError || updateUser.isError || deleteUser.isError) {
			console.error('User mutation error', createUser.error || updateUser.error || deleteUser.error)
		}
	}, [createUser.isError, updateUser.isError, deleteUser.isError, createUser.error, updateUser.error, deleteUser.error])

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<p className="text-sm uppercase tracking-wide text-primary-200">Pengguna</p>
				<h1 className="text-3xl font-semibold">Kelola pengguna</h1>
				<p className="text-sm text-slate-400">Tambah, ubah, dan hapus akun.</p>
			</div>

			<Card title="Form Pengguna" description="Hanya admin dan staff yang dapat menambah/mengubah pengguna.">
				{canManage ? (
					<form className="grid gap-3 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
						<input type="hidden" {...register('id')} />
						<FormInput label="Nama Lengkap" placeholder="Nama lengkap" {...register('fullName', { required: true })} />
						<FormInput label="Email" type="email" placeholder="nama@contoh.com" {...register('email', { required: true })} />
						<div className="sm:col-span-2">
							<label className="text-sm text-slate-300 font-medium">Role</label>
							<select className="mt-2 w-full" {...register('role', { required: true })}>
								<option value="staff">Staff</option>
								<option value="user">User</option>
							</select>
						</div>
						<FormInput
							label="Password"
							type="password"
							placeholder="Minimal 6 karakter"
							{...register('password')}
						/>
						<div className="sm:col-span-2 flex gap-2">
							<Button type="submit" loading={isSubmitting || createUser.isPending || updateUser.isPending}>
								Simpan
							</Button>
							<Button
								type="button"
								variant="secondary"
								onClick={() => reset({ fullName: '', email: '', password: '', role: 'staff' })}
							>
								Reset
							</Button>
						</div>
						{(createUser.isError || updateUser.isError) && (
							<p className="sm:col-span-2 text-sm text-rose-300">Gagal menyimpan pengguna. Periksa input.</p>
						)}
					</form>
				) : (
					<p className="text-sm text-slate-300">Akses terbatas. Hanya admin dan staff yang bisa menambah pengguna.</p>
				)}
			</Card>

			<Card title="Daftar Pengguna" description="Klik edit untuk memuat data ke form.">
				{isLoading ? (
					<p className="text-sm text-slate-400">Memuat data...</p>
				) : error ? (
					<p className="text-sm text-rose-300">{(error as Error).message}</p>
				) : visibleUsers.length === 0 ? (
					<p className="text-sm text-slate-400">Belum ada pengguna.</p>
				) : (
					<ResponsiveTable
						data={visibleUsers}
						getKey={(u) => u.id}
						columns={[
							{ key: 'fullName', header: 'Nama', render: (u) => <span className="font-semibold text-white">{u.fullName}</span> },
							{ key: 'email', header: 'Email' },
							{ key: 'role', header: 'Role', render: (u) => <span className="uppercase text-xs">{u.role}</span> },
							...(canManage
								? [
									{
										key: 'actions',
										header: 'Aksi',
										render: (u: UserDto) => (
											<div className="flex gap-2">
												<Button size="sm" variant="secondary" onClick={() => onEdit(u)}>
													Edit
												</Button>
												<Button size="sm" variant="ghost" onClick={() => onDelete(u.id)}>
													Hapus
												</Button>
											</div>
										),
									},
								]
							: []),
						]}
					/>
				)}
			</Card>
		</div>
	)
}
