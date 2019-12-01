import { useMutation } from '@apollo/react-hooks';
import { GoogleSignin } from '@react-native-community/google-signin';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { useNavigation } from 'react-navigation-hooks';
import { Routes } from '../../constants';
import { AppContext } from '../../context';
import client from '../../graphql/client';
import { MUTATION_CREATE_USER } from '../../graphql/mutation';
import { QUERY_SIGNIN, QUERY_USER_EXISTS } from '../../graphql/query';
import { Typography, ThemeStatic } from '../../theme';
import { ThemeColors } from '../../types';
import LoginBanner from '../../../assets/svg/login-banner.svg';
import GoogleLogo from '../../../assets/svg/google-logo.svg';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { Button } from '../../layout';

const { FontWeights, FontSizes } = Typography;

const LoginScreen: React.FC = () => {
  const { theme, updateUser } = useContext(AppContext);
  const { navigate } = useNavigation();
  const [createUser] = useMutation(MUTATION_CREATE_USER);
  const [loading, setLoading] = useState(false);

  const navigateToApp = async (token: string) => {
    const { data: { signIn: { id, avatar, handle } } } = await client
      .query({
        query: QUERY_SIGNIN,
        variables: { token }
      });
    updateUser({ id, avatar, handle });
    navigate(Routes.App);
  };

  const initialize = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      SplashScreen.hide();
      if (isSignedIn) {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser) {
          navigateToApp(currentUser.user.id);
        }
      }
    } catch ({ message }) {
      alert(JSON.stringify(message));
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const onGoogleSignIn = async () => {

    if (loading) return;

    try {
      setLoading(true);
      const data = await GoogleSignin.signIn();
      const { user: { id: token, name, photo } } = data;
      const { data: { userExists } } = await client.query({ query: QUERY_USER_EXISTS, variables: { token } });
      if (!userExists) {
        await createUser({ variables: { token: token, avatar: photo, name } });
      }
      setLoading(false);
      navigateToApp(token);
    } catch ({ message }) {
      setLoading(false);
      alert(JSON.stringify({ message }));
    }
  };

  return (
    <View style={styles(theme).container}>
      <View style={styles(theme).content}>
        <Text style={styles(theme).titleText}>Proximity</Text>
        <Text style={styles(theme).subtitleText}>
          Welcome to a open
          source social media where you are
          more than a statistics
        </Text>
      </View>
      <View style={styles(theme).banner}>
        <LoginBanner />
        <View>
          <Button
            Icon={GoogleLogo}
            label='Sign in with Google'
            onPress={onGoogleSignIn}
            containerStyle={styles(theme).loginButton}
            labelStyle={styles(theme).loginButtonText}
            indicatorColor={ThemeStatic.accent}
            loading={loading}
          />
          <TouchableOpacity
            onPress={() => null}
            style={styles(theme).terms}>
            <Text style={styles(theme).termsText}>Terms and conditions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = (theme = {} as ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.base
  },
  content: {
    marginTop: 40,
    marginHorizontal: 20
  },
  titleText: {
    ...FontWeights.Bold,
    ...FontSizes.Heading,
    color: theme.text01
  },
  subtitleText: {
    ...FontWeights.Light,
    ...FontSizes.Label,
    marginTop: 10,
    color: theme.text02
  },
  banner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: responsiveHeight(12),
    paddingBottom: 16,
  },
  loginButton: {
    height: 44,
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginBottom: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.accent,
    backgroundColor: theme.base
  },
  loginButtonText: {
    ...FontWeights.Regular,
    ...FontSizes.Body,
    marginLeft: 10,
    color: theme.accent
  },
  terms: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  termsText: {
    ...FontWeights.Light,
    ...FontSizes.Body,
    color: theme.text02
  }
});

export default LoginScreen;