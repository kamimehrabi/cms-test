"use client";

import React, { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter,
    ModalTitle,
    ModalDescription,
    ConfirmModal,
    InfoModal,
    FullScreenModal,
} from "./Modal";
import Button from "../Button";

export function ModalExamples() {
    const [basicOpen, setBasicOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [infoOpen, setInfoOpen] = useState(false);
    const [fullScreenOpen, setFullScreenOpen] = useState(false);
    const [customOpen, setCustomOpen] = useState(false);

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold mb-8">Modal Component Examples</h1>

            {/* Basic Modal */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Basic Modal</h2>
                <Button onClick={() => setBasicOpen(true)}>Open Basic Modal</Button>

                <Modal open={basicOpen} onClose={() => setBasicOpen(false)}>
                    <ModalHeader>
                        <ModalTitle>Modal Title</ModalTitle>
                    </ModalHeader>
                    <ModalContent>
                        <ModalDescription>
                            This is a basic modal with header, content, and footer sections.
                        </ModalDescription>
                        <p className="mt-4">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                    </ModalContent>
                    <ModalFooter>
                        <Button variant="ghost" onClick={() => setBasicOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => setBasicOpen(false)}>
                            Confirm
                        </Button>
                    </ModalFooter>
                </Modal>
            </section>

            {/* Confirmation Modal */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Confirmation Modal</h2>
                <Button onClick={() => setConfirmOpen(true)}>
                    Open Confirmation Modal
                </Button>

                <ConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <ModalHeader>
                        <ModalTitle>Are you sure?</ModalTitle>
                    </ModalHeader>
                    <ModalContent>
                        <ModalDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </ModalDescription>
                    </ModalContent>
                    <ModalFooter align="between">
                        <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                setConfirmOpen(false);
                                alert("Confirmed!");
                            }}
                        >
                            Yes, delete
                        </Button>
                    </ModalFooter>
                </ConfirmModal>
            </section>

            {/* Info Modal */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Info Modal</h2>
                <Button onClick={() => setInfoOpen(true)}>Open Info Modal</Button>

                <InfoModal open={infoOpen} onClose={() => setInfoOpen(false)}>
                    <ModalHeader variant="primary">
                        <ModalTitle>Information</ModalTitle>
                    </ModalHeader>
                    <ModalContent>
                        <ModalDescription>
                            Here's some important information you should know.
                        </ModalDescription>
                        <ul className="list-disc list-inside mt-4 space-y-2">
                            <li>First important point</li>
                            <li>Second important point</li>
                            <li>Third important point</li>
                        </ul>
                    </ModalContent>
                    <ModalFooter align="center">
                        <Button variant="primary" onClick={() => setInfoOpen(false)}>
                            Got it!
                        </Button>
                    </ModalFooter>
                </InfoModal>
            </section>

            {/* Full Screen Modal */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Full Screen Modal</h2>
                <Button onClick={() => setFullScreenOpen(true)}>
                    Open Full Screen Modal
                </Button>

                <FullScreenModal
                    open={fullScreenOpen}
                    onClose={() => setFullScreenOpen(false)}
                >
                    <ModalHeader>
                        <ModalTitle>Full Screen Content</ModalTitle>
                    </ModalHeader>
                    <ModalContent>
                        <h3 className="text-lg font-semibold mb-4">
                            Large Content Area
                        </h3>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <p key={i} className="mb-4">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                Paragraph {i + 1}.
                            </p>
                        ))}
                    </ModalContent>
                    <ModalFooter>
                        <Button
                            variant="primary"
                            onClick={() => setFullScreenOpen(false)}
                        >
                            Close
                        </Button>
                    </ModalFooter>
                </FullScreenModal>
            </section>

            {/* Custom Styled Modal */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Custom Styled Modal</h2>
                <Button onClick={() => setCustomOpen(true)}>
                    Open Custom Modal
                </Button>

                <Modal
                    open={customOpen}
                    onClose={() => setCustomOpen(false)}
                    size="lg"
                    animation="slide"
                    backdrop="dark"
                >
                    <ModalHeader variant="accent">
                        <ModalTitle>Custom Styling</ModalTitle>
                    </ModalHeader>
                    <ModalContent spacing="relaxed">
                        <ModalDescription>
                            This modal has custom size, animation, and backdrop options.
                        </ModalDescription>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <div className="p-4 bg-primary/10 rounded-lg">
                                <h4 className="font-semibold mb-2">Feature 1</h4>
                                <p className="text-sm text-base-content/70">
                                    Description of feature 1
                                </p>
                            </div>
                            <div className="p-4 bg-secondary/10 rounded-lg">
                                <h4 className="font-semibold mb-2">Feature 2</h4>
                                <p className="text-sm text-base-content/70">
                                    Description of feature 2
                                </p>
                            </div>
                        </div>
                    </ModalContent>
                    <ModalFooter align="right">
                        <Button variant="ghost" onClick={() => setCustomOpen(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => setCustomOpen(false)}>
                            Save Changes
                        </Button>
                    </ModalFooter>
                </Modal>
            </section>

            {/* Size Variants */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Size Variants</h2>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setBasicOpen(true)} size="sm">
                        Small
                    </Button>
                    <Button onClick={() => setBasicOpen(true)} size="md">
                        Medium
                    </Button>
                    <Button onClick={() => setBasicOpen(true)} size="lg">
                        Large
                    </Button>
                </div>
            </section>

            {/* Props Configuration */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Modal Props</h2>
                <div className="space-y-2 text-sm">
                    <p><strong>closeOnBackdrop:</strong> Click outside to close (default: true)</p>
                    <p><strong>closeOnEscape:</strong> Press ESC to close (default: true)</p>
                    <p><strong>showCloseButton:</strong> Show X button (default: true)</p>
                    <p><strong>preventScroll:</strong> Prevent body scroll (default: true)</p>
                    <p><strong>portal:</strong> Render in portal (default: true)</p>
                </div>
            </section>
        </div>
    );
}

export default ModalExamples;

