"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { User } from "next-auth";
import { Trash2, UserPen } from "lucide-react";
import { Button } from "./ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { UserEditDrawer } from "./UserEditDrawer";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

interface UserTableProps {
  users: User[];
  roles: string;
  permissions: string[];
}

export function UserTable({ users, roles, permissions }: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (selectedUser) {
        await axios.delete(
          `/api/deleteUser?id=${selectedUser.id}&email=${selectedUser.email}`
        );
        console.log(`User with ID ${selectedUser.id} deleted`);
      }
      setDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleUpdate = () => {
    setDrawerOpen(false);
  };

  return (
    <>
      <div className="rounded-md border mt-2 ">
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="text-center items-center justify-center align-middle bg-gray-900">
                <TableHead className="text-center">Name</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Role</TableHead>
                <TableHead className="text-center">Permissions</TableHead>
                <TableHead className="text-center">Status</TableHead>
                {(permissions.includes("UPDATE") || roles === "ADMIN") && (
                  <TableHead className="text-center">Actions</TableHead>
                )}
                {(permissions.includes("DELETE") || roles === "ADMIN") && (
                  <TableHead className="text-center">Delete</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 &&
                users.map((user: User) => (
                  <TableRow key={user.id} className="text-center">
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.permissions.join(", ")}</TableCell>
                    <TableCell>{user.status}</TableCell>
                    {(permissions.includes("UPDATE") || roles === "ADMIN") && (
                      <TableCell>
                        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                          <DrawerTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => handleEditClick(user)}
                            >
                              <UserPen className="h-4 w-4" />
                            </Button>
                          </DrawerTrigger>
                          {selectedUser && (
                            <UserEditDrawer
                              user={selectedUser}
                              onUpdate={handleUpdate}
                              onClose={() => setDrawerOpen(false)}
                            />
                          )}
                        </Drawer>
                      </TableCell>
                    )}
                    {(permissions.includes("DELETE") || roles === "ADMIN") && (
                      <TableCell>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you sure you want to delete this user?
                              </DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={handleDeleteConfirm}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="md:hidden space-y-4 px-4">
  {users.map((user) => (
    <div
      key={user.id}
      className="bg-black w-full max-w-sm text-sm p-6 border border-gray-300 rounded-lg shadow-sm mx-auto"
    >
      <div className="mb-2 text-white">
        <strong>Name:</strong> {user.name}
      </div>
      <div className="mb-2 text-white">
        <strong>Email:</strong> {user.email}
      </div>
      <div className="mb-2 text-white">
        <strong>Role:</strong> {user.role}
      </div>
      <div className="mb-2 text-white">
        <strong>Permissions:</strong> {user.permissions.join(", ")}
      </div>
      <div className="mb-2 text-white">
        <strong>Status:</strong> {user.status}
      </div>
      <div className="flex flex-wrap space-x-2">
        {(permissions.includes("UPDATE") || roles === "ADMIN") && (
          <Button variant="default" onClick={() => handleEditClick(user)}>
            Edit
          </Button>
        )}
        {(permissions.includes("DELETE") || roles === "ADMIN") && (
          <Button
            variant="destructive"
            onClick={() => handleDeleteClick(user)}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  ))}
</div>

    </>
  );
}
