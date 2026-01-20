import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { createTag, updateTag, getTagById } from "../services/tag.service";

interface TagFormData {
    name: string;
    description?: string;
    color: string;
}

export default function TagForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm<TagFormData>({
        defaultValues: {
            name: "",
            description: "",
            color: "#000000",
        },
    });

    const colorValue = watch("color");

    const loadTag = useCallback(async () => {
        try {
            setInitialLoading(true);
            setError(null);
            const response = await getTagById(id!);
            const tag = response.data;
            reset({
                name: tag.name,
                description: tag.description || "",
                color: tag.color,
            });
        } catch (err: any) {
            setError(
                err.response?.data?.error?.message || "Failed to load tag",
            );
        } finally {
            setInitialLoading(false);
        }
    }, [id, reset]);

    useEffect(() => {
        if (isEditMode && id) {
            loadTag();
        }
    }, [id, isEditMode, loadTag]);

    const onSubmit = async (data: TagFormData) => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                name: data.name,
                description: data.description,
                color: data.color,
            };

            if (isEditMode && id) {
                await updateTag(id, payload);
            } else {
                await createTag(payload);
            }

            navigate("/dashboard/tags");
        } catch (err: any) {
            console.error("Error saving tag:", err);

            const errorMessage =
                err.response?.data?.error?.message ||
                err.response?.data?.message ||
                err.message ||
                `Failed to ${isEditMode ? "update" : "create"} tag`;

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/dashboard/tags");
    };

    if (initialLoading) {
        return (
            <div className="container mx-auto py-6">
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span>Loading tag...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-6 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>
                        {isEditMode ? "Edit Tag" : "Create New Tag"}
                    </CardTitle>
                    <CardDescription>
                        {isEditMode
                            ? "Update the tag information below."
                            : "Create a new tag to organize your content."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                {...register("name", {
                                    required: "Name is required",
                                    minLength: {
                                        value: 2,
                                        message:
                                            "Name must be at least 2 characters",
                                    },
                                    maxLength: {
                                        value: 50,
                                        message:
                                            "Name must be less than 50 characters",
                                    },
                                })}
                                placeholder="Enter tag name"
                                disabled={loading}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                {...register("description", {
                                    maxLength: {
                                        value: 200,
                                        message:
                                            "Description must be less than 200 characters",
                                    },
                                })}
                                placeholder="Enter tag description (optional)"
                                disabled={loading}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <div className="flex items-center gap-3">
                                <Input
                                    id="color"
                                    type="color"
                                    {...register("color")}
                                    className="w-20 h-10 p-1 cursor-pointer"
                                    disabled={loading}
                                />
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full border-2 border-gray-300"
                                        style={{ backgroundColor: colorValue }}
                                    />
                                    <span className="text-sm text-muted-foreground font-mono">
                                        {colorValue}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        {isEditMode
                                            ? "Updating..."
                                            : "Creating..."}
                                    </>
                                ) : isEditMode ? (
                                    "Update Tag"
                                ) : (
                                    "Create Tag"
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
