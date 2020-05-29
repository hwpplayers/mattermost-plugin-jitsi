import * as React from 'react';
import {describe, expect, it} from '@jest/globals';
import {shallow} from 'enzyme';

import {Post} from 'mattermost-redux/types/posts';

import {PostTypeJitsi} from './post_type_jitsi';

describe('PostTypeJitsi', () => {
    const basePost: Post = {
        id: 'test',
        create_at: 100,
        update_at: 100,
        edit_at: 100,
        delete_at: 100,
        message: 'test-message',
        is_pinned: false,
        user_id: 'test-user-id',
        channel_id: 'test-channel-id',
        root_id: '',
        parent_id: '',
        original_id: '',
        type: 'custom_jitsi',
        hashtags: '',
        props: {
            jwt_meeting_valid_until: 123,
            meeting_link: 'http://test-meeting-link/test',
            jwt_meeting: true,
            meeting_jwt: 'xxxxxxxxxxxx',
            meeting_topic: 'Test topic',
            meeting_id: 'test',
            meeting_personal: false
        }
    };

    const actions = {
        enrichMeetingJwt: jest.fn().mockImplementation(() => Promise.resolve({data: {jwt: 'test-enriched-jwt'}}))
    };

    const theme = {
        buttonColor: '#fabada'
    };

    const defaultProps = {
        post: basePost,
        theme,
        creatorName: 'test',
        useMilitaryTime: false,
        actions
    };

    it('should render null if the post type is null', () => {
        defaultProps.actions.enrichMeetingJwt.mockClear();
        const props = {...defaultProps};
        delete props.post;
        const wrapper = shallow(
            <PostTypeJitsi {...props}/>
        );
        expect(wrapper).toMatchSnapshot();
        expect(defaultProps.actions.enrichMeetingJwt).not.toBeCalled();
    });

    it('should render a post if the post type is not null, and should try to enrich the token', () => {
        defaultProps.actions.enrichMeetingJwt.mockClear();
        const wrapper = shallow(
            <PostTypeJitsi {...defaultProps}/>
        );
        expect(defaultProps.actions.enrichMeetingJwt).toBeCalled();
        expect(wrapper).toMatchSnapshot();
    });

    it('should render a post without token if there is no jwt token, and shouldn\'t try to enrich the token', () => {
        defaultProps.actions.enrichMeetingJwt.mockClear();
        const props = {
            ...defaultProps,
            post: {
                ...defaultProps.post,
                props: {
                    ...defaultProps.post.props,
                    jwt_meeting: false
                }
            }
        };

        const wrapper = shallow(
            <PostTypeJitsi {...props}/>
        );
        expect(wrapper).toMatchSnapshot();
        expect(defaultProps.actions.enrichMeetingJwt).not.toBeCalled();
    });

    it('should render the default topic if the topic is empty', () => {
        const props = {
            ...defaultProps,
            post: {
                ...defaultProps.post,
                props: {
                    ...defaultProps.post.props,
                    meeting_topic: null
                }
            }
        };

        const wrapper = shallow(
            <PostTypeJitsi {...props}/>
        );
        expect(wrapper.find('h1')).toMatchSnapshot();
    });

    it('should render the a different subtitle if the meeting is personal', () => {
        const props = {
            ...defaultProps,
            post: {
                ...defaultProps.post,
                props: {
                    ...defaultProps.post.props,
                    meeting_personal: true
                }
            }
        };

        const wrapper = shallow(
            <PostTypeJitsi {...props}/>
        );
        expect(wrapper).toMatchSnapshot();
    });
});