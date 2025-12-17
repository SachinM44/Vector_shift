# VectorShift Frontend Assessment - Requirements Document

## Introduction

This document outlines the requirements for the VectorShift Frontend Technical Assessment. The goal is to enhance an existing React-based visual pipeline builder with improved node abstraction, professional styling, dynamic text node functionality, and backend integration for pipeline validation.

## Glossary

- **Node**: A visual component in the pipeline representing a processing step (Input, LLM, Output, Text, etc.)
- **Edge**: A connection between two nodes representing data flow
- **Handle**: A connection point on a node where edges can attach (source or target)
- **Pipeline**: A collection of connected nodes and edges forming a workflow
- **DAG**: Directed Acyclic Graph - a graph with directed edges and no cycles
- **ReactFlow**: The library used for rendering the node-based editor
- **Zustand**: State management library for global application state
- **Variable Handle**: A dynamically created input handle based on variable syntax in text

---

## Requirements

### Requirement 1: Node Abstraction System

**User Story:** As a developer, I want a reusable node abstraction system, so that I can quickly create new node types without duplicating code.

#### Acceptance Criteria

1. WHEN creating a new node type THEN the system SHALL use a shared base component that handles common functionality
2. WHEN defining a node configuration THEN the system SHALL accept a declarative configuration object specifying node properties
3. WHEN a node is rendered THEN the system SHALL automatically generate handles based on configuration
4. WHEN adding five new node types THEN the system SHALL demonstrate code reuse and minimal duplication
5. WHEN styling is applied to the base component THEN all node types SHALL inherit the styling automatically

### Requirement 2: Professional UI Styling

**User Story:** As a user, I want a visually appealing and professional interface, so that the application feels polished and easy to use.

#### Acceptance Criteria

1. WHEN the application loads THEN the system SHALL display a cohesive design system with consistent colors, typography, and spacing
2. WHEN viewing nodes THEN the system SHALL render them with modern styling including shadows, rounded corners, and proper visual hierarchy
3. WHEN interacting with draggable elements THEN the system SHALL provide visual feedback through hover states and cursor changes
4. WHEN viewing the toolbar THEN the system SHALL organize node types in a clean, accessible layout
5. WHEN viewing the canvas THEN the system SHALL provide a professional background and clear visual boundaries
6. WHEN viewing edges THEN the system SHALL render them with appropriate styling and animations
7. WHEN using the submit button THEN the system SHALL display it prominently with clear call-to-action styling

### Requirement 3: Dynamic Text Node Functionality

**User Story:** As a user, I want the text node to resize dynamically and support variable inputs, so that I can create flexible text templates with multiple inputs.

#### Acceptance Criteria

1. WHEN a user types text into a Text node THEN the system SHALL automatically adjust the node width and height to fit the content
2. WHEN a user enters a variable in the format `{{variableName}}` THEN the system SHALL detect the variable syntax
3. WHEN a valid JavaScript variable name is detected within double curly brackets THEN the system SHALL create a new input handle on the left side of the Text node
4. WHEN multiple variables are defined THEN the system SHALL create multiple handles, one for each unique variable
5. WHEN a variable is removed from the text THEN the system SHALL remove the corresponding handle
6. WHEN handles are created THEN the system SHALL position them vertically with appropriate spacing
7. WHEN the text content changes THEN the system SHALL update handles in real-time without requiring a re-render of the entire pipeline

### Requirement 4: Backend Pipeline Validation

**User Story:** As a user, I want to validate my pipeline by submitting it to the backend, so that I can verify the pipeline structure and ensure it forms a valid DAG.

#### Acceptance Criteria

1. WHEN the submit button is clicked THEN the system SHALL serialize the current nodes and edges into JSON format
2. WHEN the pipeline data is ready THEN the system SHALL send a POST request to the `/pipelines/parse` endpoint
3. WHEN the backend receives the pipeline THEN the system SHALL calculate the number of nodes in the pipeline
4. WHEN the backend receives the pipeline THEN the system SHALL calculate the number of edges in the pipeline
5. WHEN the backend receives the pipeline THEN the system SHALL determine whether the pipeline forms a directed acyclic graph
6. WHEN the backend completes validation THEN the system SHALL return a response in the format `{num_nodes: int, num_edges: int, is_dag: bool}`
7. WHEN the frontend receives the response THEN the system SHALL display an alert showing the number of nodes, number of edges, and DAG status
8. WHEN displaying the alert THEN the system SHALL format the information in a user-friendly, readable manner
9. WHEN the backend request fails THEN the system SHALL display an error message to the user

### Requirement 5: Code Quality and Architecture

**User Story:** As a developer maintaining this codebase, I want clean, well-organized code, so that the application is easy to understand, extend, and debug.

#### Acceptance Criteria

1. WHEN reviewing the code THEN the system SHALL follow React best practices including proper component composition and hooks usage
2. WHEN examining component structure THEN the system SHALL demonstrate clear separation of concerns
3. WHEN reading the code THEN the system SHALL include meaningful comments explaining complex logic
4. WHEN adding new features THEN the system SHALL maintain consistent code style and naming conventions
5. WHEN managing state THEN the system SHALL use Zustand store appropriately without prop drilling
