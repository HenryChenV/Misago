from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.utils.translation import gettext as _

from misago.core.exceptions import Banned

from misago.users.bans import get_request_ip_ban
from misago.users.models import Ban, BAN_IP


def deny_authenticated(f):
    def decorator(request, *args, **kwargs):
        if request.user.is_authenticated():
            raise PermissionDenied(
                _("This action is not available to signed in users."))
        else:
            return f(request, *args, **kwargs)
    return decorator


def deny_guests(f):
    def decorator(request, *args, **kwargs):
        if request.user.is_anonymous():
            raise PermissionDenied(
                _("This action is not available to guests."))
        else:
            return f(request, *args, **kwargs)
    return decorator


def deny_banned_ips(f):
    def decorator(request, *args, **kwargs):
        ban = get_request_ip_ban(request)
        if ban:
            hydrated_ban = Ban(
                check_type=BAN_IP,
                user_message=ban['message'],
                expires_on=ban['expires_on'])
            raise Banned(hydrated_ban)
        else:
            return f(request, *args, **kwargs)
    return decorator
